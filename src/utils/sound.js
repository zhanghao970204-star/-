/**
 * 轻量音效（移植自晋迈 Sound：点击 / 开关 / 转盘）
 * 音量与静音存 localStorage，供设置页控制。
 */

import btnClickUrl from "@/assets/mp3/btn_click.mp3";
import btnCloseUrl from "@/assets/mp3/btn_close.mp3";
import switchUrl from "@/assets/mp3/switch.mp3";
import wheelSpinUrl from "@/assets/mp3/wheel_spin.mp3";
import wheelResultUrl from "@/assets/mp3/wheel_result.mp3";

const LS_VOLUME = "appSoundVolume";
const LS_MUTE = "appSoundMute";

const SOUND_URLS = {
  "btn_click.mp3": btnClickUrl,
  "btn_close.mp3": btnCloseUrl,
  "switch.mp3": switchUrl,
  "wheel_spin.mp3": wheelSpinUrl,
  "wheel_result.mp3": wheelResultUrl,
};

const audioCache = new Map();
const audioPool = new Map();
const POOL_SIZE = 4;

let audioCtx = null;
const bufferCache = new Map();

function readVolume() {
  const n = Number(localStorage.getItem(LS_VOLUME));
  if (Number.isFinite(n)) return Math.min(100, Math.max(0, n));
  return 70;
}

function readMute() {
  // 总开关关闭则无声；音量滑到 0 也无声
  return localStorage.getItem(LS_MUTE) === "1" || readVolume() <= 0;
}

function effectiveVolume(base = 0.3) {
  if (readMute()) return 0;
  return base * (readVolume() / 100);
}

function ensureAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    } catch (e) {
      audioCtx = null;
    }
  }
  return audioCtx;
}

async function loadBuffer(fileName) {
  if (bufferCache.has(fileName)) return bufferCache.get(fileName);
  const ctx = ensureAudioContext();
  const url = SOUND_URLS[fileName];
  if (!ctx || !url) return null;
  try {
    const res = await fetch(url, { cache: "force-cache" });
    const arr = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arr);
    bufferCache.set(fileName, buf);
    return buf;
  } catch (e) {
    return null;
  }
}

function playWithBuffer(fileName, volume) {
  const ctx = ensureAudioContext();
  const buf = bufferCache.get(fileName);
  if (!ctx || !buf) return false;
  try {
    const source = ctx.createBufferSource();
    source.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    source.connect(gain).connect(ctx.destination);
    source.start();
    return true;
  } catch (e) {
    return false;
  }
}

function ensurePool(fileName) {
  let pool = audioPool.get(fileName);
  if (!pool) {
    pool = [];
    audioPool.set(fileName, pool);
  }
  const url = SOUND_URLS[fileName];
  if (!url) return pool;
  while (pool.length < POOL_SIZE) {
    const el = new Audio(url);
    el.preload = "metadata";
    pool.push(el);
  }
  if (!audioCache.has(fileName) && pool[0]) {
    audioCache.set(fileName, pool[0]);
  }
  return pool;
}

function playInstant(fileName, baseVol = 0.3) {
  const volume = effectiveVolume(baseVol);
  if (volume <= 0) return;
  try {
    const ctx = ensureAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    if (playWithBuffer(fileName, volume)) return;
    loadBuffer(fileName).catch(() => {});

    const pool = ensurePool(fileName);
    let audio = pool.find((a) => a.paused || a.ended);
    if (!audio) {
      if (pool.length < POOL_SIZE + 2) {
        const el = new Audio(SOUND_URLS[fileName]);
        el.preload = "metadata";
        pool.push(el);
        audio = el;
      } else {
        audio = pool[0];
      }
    }
    if (!audio) return;
    try {
      audio.currentTime = 0;
    } catch (e) {
      /* ignore */
    }
    audio.volume = Math.min(1, volume);
    const p = audio.play();
    if (p) p.catch(() => {});
  } catch (e) {
    /* ignore autoplay blocks */
  }
}

function playSound(fileName, baseVol = 0.3) {
  const volume = effectiveVolume(baseVol);
  if (volume <= 0) return;
  let audio = audioCache.get(fileName);
  if (!audio) {
    const url = SOUND_URLS[fileName];
    if (!url) return;
    audio = new Audio(url);
    audio.preload = "metadata";
    audioCache.set(fileName, audio);
  }
  try {
    audio.currentTime = 0;
    audio.volume = Math.min(1, volume);
    const p = audio.play();
    if (p) p.catch(() => {});
  } catch (e) {
    /* ignore */
  }
}

export function getSoundVolume() {
  return readVolume();
}

export function setSoundVolume(vol) {
  const n = Math.min(100, Math.max(0, Number(vol) || 0));
  localStorage.setItem(LS_VOLUME, String(n));
}

/** 总开关：true=开（有声音），false=关 */
export function isSoundEnabled() {
  return localStorage.getItem(LS_MUTE) !== "1";
}

export function setSoundEnabled(enabled) {
  localStorage.setItem(LS_MUTE, enabled ? "0" : "1");
}

export function setMute(mute) {
  setSoundEnabled(!mute);
}

export function isMuted() {
  return readMute();
}

export const playClickSound = () => playInstant("btn_click.mp3", 0.3);
export const playCloseSound = () => playSound("btn_close.mp3", 0.3);
export const playSwitchSound = () => playSound("switch.mp3", 0.3);
export const playWheelSound = () => playSound("wheel_spin.mp3", 0.35);
export const playWheelResultSound = () => playSound("wheel_result.mp3", 0.35);

const CLICK_SOUND_SEL = [
  "a",
  "button",
  "[role='button']",
  ".van-tabbar-item",
  ".van-nav-bar__left",
  ".van-nav-bar__right",
  ".van-grid-item",
  ".van-cell",
  ".van-button",
  ".van-tab",
  ".van-swipe-item",
  "[data-click-sound]",
].join(",");

let globalClickInstalled = false;
let lastClickSoundAt = 0;

function shouldPlayGlobalClick(target) {
  if (!target || !(target instanceof Element)) return false;
  if (target.closest("[data-no-sound]")) return false;
  if (target.closest("input, textarea, select, label, .settings-slider")) {
    return false;
  }
  if (target.closest(CLICK_SOUND_SEL)) return true;
  // 自定义可点块（首页活动 / 游戏卡片等）
  let el = target;
  for (let i = 0; i < 5 && el && el !== document.body; i++) {
    try {
      if (window.getComputedStyle(el).cursor === "pointer") return true;
    } catch (e) {
      break;
    }
    el = el.parentElement;
  }
  return false;
}

/** 全局：路由 Tab / 按钮 / 可点内容 点击音效（受总开关控制） */
export function installGlobalClickSound() {
  if (typeof document === "undefined" || globalClickInstalled) return;
  globalClickInstalled = true;
  document.addEventListener(
    "click",
    (e) => {
      if (!shouldPlayGlobalClick(e.target)) return;
      const now = Date.now();
      if (now - lastClickSoundAt < 80) return;
      lastClickSoundAt = now;
      playClickSound();
    },
    true,
  );
}

// 空闲时预解码常用音效
if (typeof window !== "undefined") {
  const preload = () => {
    ["btn_click.mp3", "switch.mp3", "wheel_spin.mp3"].forEach((f) => {
      ensurePool(f);
      loadBuffer(f).catch(() => {});
    });
  };
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(preload, { timeout: 3000 });
  } else {
    setTimeout(preload, 1200);
  }
}
