/**
 * App / H5 统一外链打开：
 * - Flutter：走 NativeBridge → 系统浏览器 / 对应 App
 * - H5：window.open
 * TG 等未安装时由原生回调，弹出通用提示
 */
import { showConfirmDialog } from "vant";
import { isNativeAppShell } from "@/utils/nativeApp";

const TG_HOST_RE = /(^|\.)t\.me$/i;
const WA_HOST_RE = /(^|\.)(wa\.me|whatsapp\.com)$/i;

function postNative(payload) {
  try {
    if (typeof window === "undefined") return false;
    if (window.NativeBridge && typeof window.NativeBridge.postMessage === "function") {
      window.NativeBridge.postMessage(JSON.stringify(payload));
      return true;
    }
  } catch (e) {
    /* ignore */
  }
  return false;
}

export function isTelegramUrl(url) {
  if (!url) return false;
  const s = String(url);
  if (/^tg:/i.test(s)) return true;
  try {
    const u = new URL(s, window.location.href);
    return TG_HOST_RE.test(u.hostname);
  } catch (e) {
    return /t\.me\//i.test(s);
  }
}

export function isWhatsAppUrl(url) {
  if (!url) return false;
  const s = String(url);
  if (/^whatsapp:/i.test(s)) return true;
  try {
    const u = new URL(s, window.location.href);
    return WA_HOST_RE.test(u.hostname);
  } catch (e) {
    return /wa\.me\//i.test(s) || /whatsapp\.com/i.test(s);
  }
}

/** 支付 / 需系统浏览器打开的 http(s) 外链 */
export function isPaymentLikeUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(String(url), window.location.href);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    // 同源当站内
    if (u.origin === window.location.origin) return false;
    return true;
  } catch (e) {
    return /^https?:\/\//i.test(String(url));
  }
}

function detectKind(url, kind) {
  if (kind) return kind;
  if (isTelegramUrl(url)) return "telegram";
  if (isWhatsAppUrl(url)) return "whatsapp";
  if (isPaymentLikeUrl(url)) return "payment";
  return "external";
}

function openInWeb(url) {
  if (!url) return false;
  let win = null;
  try {
    win = window.open(url, "_blank");
  } catch (e) {
    win = null;
  }
  if (win) {
    try {
      win.opener = null;
    } catch (e) {
      /* ignore */
    }
    return true;
  }
  try {
    window.location.href = url;
    return true;
  } catch (e) {
    return false;
  }
}

function appLabel(kind) {
  if (kind === "telegram") return "Telegram";
  if (kind === "whatsapp") return "WhatsApp";
  return "the app";
}

/**
 * 打开外链。App 内优先原生；失败则弹窗提示未安装，可改用浏览器打开。
 * @param {string} url
 * @param {{ kind?: string, title?: string }} [options]
 */
export function openExternalUrl(url, options = {}) {
  if (!url) return false;
  const kind = detectKind(url, options.kind);

  if (isNativeAppShell() && postNative({ action: "openExternal", url, kind })) {
    return true;
  }
  return openInWeb(url);
}

/** 原生打不开 App 时回调（Flutter 注入） */
export function installNativeOpenExternalFailHandler() {
  if (typeof window === "undefined") return;
  window.__onNativeOpenExternalFail = async (payload) => {
    const data =
      typeof payload === "string"
        ? (() => {
            try {
              return JSON.parse(payload);
            } catch (e) {
              return { url: payload };
            }
          })()
        : payload || {};
    const url = data.url || "";
    const kind = data.kind || detectKind(url);
    const name = appLabel(kind);
    try {
      await showConfirmDialog({
        title: "App not installed",
        message: `${name} is not installed. Open this link in your browser instead?`,
        confirmButtonText: "Open in browser",
        cancelButtonText: "Cancel",
        className: "external-app-missing-dialog",
      });
      openInWeb(url);
    } catch (e) {
      /* user cancel */
    }
  };
}
