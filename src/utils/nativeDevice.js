/**
 * 客户端唯一标识（传后端 uuid）
 *
 * 优先级：
 * 1. Flutter 注入的 uuid（App 内）
 * 2. Adjust web_uuid（H5，分享链接 getIsFbReport 返回 target 为 "ad" 时）
 * 3. 浏览器指纹 FingerprintJS visitorId（H5）
 * 4. 本地随机 uuid（指纹失败兜底；App 内 Flutter 未注入前临时使用）
 *
 * Flutter onPageFinished：
 *   window.setNativeUuid('flutter-uuid');
 * 或：
 *   window.setNativeClientIds({ uuid: 'flutter-uuid' });
 */

import { STORAGE_KEYS } from './appConstants';
import { getFingerprint } from './common';
import { isNativeAppShell } from './nativeApp';

const UUID_KEY = "__NATIVE_UUID__";

function norm(v) {
  return v == null ? "" : String(v).trim();
}

function notifyReady(id) {
  if (typeof window.__onNativeClientId === "function") {
    try {
      window.__onNativeClientId(id);
    } catch (_) {
      /* ignore */
    }
  }
}

function applyFingerprint(id) {
  if (!id) return;
  try {
    window.fingerprint = id;
  } catch (_) {
    /* ignore */
  }
}

export function setNativeUuid(uuid) {
  const value = norm(uuid);
  if (!value) return "";
  try {
    window[UUID_KEY] = value;
    window.nativeUuid = value;
    window.flutterUuid = value;
    localStorage.setItem("flutter_uuid", value);
  } catch (_) {
    /* ignore */
  }
  applyFingerprint(value);
  notifyReady(value);
  return value;
}

/** 兼容旧调用：按 uuid 处理 */
export function setNativeDeviceId(id) {
  return setNativeUuid(id);
}

export function setNativeClientIds(payload = {}) {
  const uuid = norm(
    payload.uuid ||
      payload.nativeUuid ||
      payload.flutterUuid ||
      payload.deviceId,
  );
  if (uuid) return setNativeUuid(uuid);
  return resolveClientIdSync();
}

export function peekFlutterUuid() {
  try {
    return (
      norm(window[UUID_KEY]) ||
      norm(window.nativeUuid) ||
      norm(window.flutterUuid) ||
      norm(window.flutter_uuid) ||
      norm(
        typeof localStorage !== "undefined"
          ? localStorage.getItem("flutter_uuid")
          : "",
      ) ||
      ""
    );
  } catch (_) {
    return "";
  }
}

/** ad 类型分享链接且 Adjust SDK 已生成 web_uuid 时返回，否则空串 */
export function peekAdjustUuid() {
  try {
    if (isNativeAppShell()) return "";
    if (localStorage.getItem(STORAGE_KEYS.adjustUuidMode) !== "1") return "";
    return norm(localStorage.getItem(STORAGE_KEYS.adjustWebUuid));
  } catch (_) {
    return "";
  }
}

function peekCachedFingerprint() {
  try {
    return norm(localStorage.getItem(STORAGE_KEYS.fingerprint));
  } catch (_) {
    return "";
  }
}

export function peekVueLocalUuid() {
  try {
    return (
      peekCachedFingerprint() ||
      norm(window.fingerprint) ||
      norm(localStorage.getItem("vue_guest_uuid")) ||
      ""
    );
  } catch (_) {
    /* ignore */
  }
  return "";
}

/** 保证始终有可用 uuid（Flutter 没有时本地生成并持久化） */
export function ensureLocalUuid() {
  const existing = peekVueLocalUuid();
  if (existing) return existing;
  let id = "";
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      id = crypto.randomUUID();
    } else {
      id = `v-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    }
    localStorage.setItem("vue_guest_uuid", id);
    window.fingerprint = id;
  } catch (_) {
    id = `v-${Date.now()}`;
  }
  return id;
}

function readQueryUuid() {
  try {
    const q = new URLSearchParams(window.location.search || "");
    return norm(
      q.get("nativeUuid") ||
        q.get("flutterUuid") ||
        q.get("uuid") ||
        q.get("nativeDeviceId") ||
        q.get("deviceId"),
    );
  } catch (_) {
    return "";
  }
}

/** 同步：Flutter uuid → Adjust web_uuid（ad 类型）→ 指纹 → 本地 uuid；H5 不在这里生成随机值，由 ensureClientId 先算指纹 */
export function resolveClientIdSync() {
  const fromQuery = readQueryUuid();
  if (fromQuery) setNativeUuid(fromQuery);

  const id = peekFlutterUuid() || peekAdjustUuid() || peekVueLocalUuid();
  if (id) return id;
  return isNativeAppShell() ? ensureLocalUuid() : "";
}

let fingerprintPromise = null;

/**
 * H5 用浏览器指纹作为 uuid：首次访问需异步计算（之后读缓存），超时或失败才退回随机 uuid。
 * App 内保持 Flutter uuid，不等指纹。
 */
export function ensureClientId(timeoutMs = 3000) {
  if (isNativeAppShell() || peekFlutterUuid()) {
    return Promise.resolve(resolveClientIdSync());
  }
  const cached = peekCachedFingerprint();
  if (cached) {
    applyFingerprint(cached);
    return Promise.resolve(cached);
  }
  if (!fingerprintPromise) {
    const timeout = new Promise((resolve) =>
      setTimeout(() => resolve(""), timeoutMs),
    );
    fingerprintPromise = Promise.race([getFingerprint(), timeout]).then(
      (fp) => {
        const id = fp || peekVueLocalUuid() || ensureLocalUuid();
        applyFingerprint(id);
        return id;
      },
    );
  }
  return fingerprintPromise;
}

/**
 * 等待 Flutter 注入 uuid；超时则回退 Vue 本地 uuid（保证有值）
 */
export function getClientId(timeoutMs = 3000) {
  if (peekFlutterUuid()) {
    return Promise.resolve(resolveClientIdSync());
  }

  const fromQuery = readQueryUuid();
  if (fromQuery) {
    return Promise.resolve(setNativeUuid(fromQuery));
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearInterval(poll);
      window.__onNativeClientId = prev;
      resolve(resolveClientIdSync());
    };

    const prev = window.__onNativeClientId;
    window.__onNativeClientId = () => finish();

    const poll = setInterval(() => {
      if (peekFlutterUuid()) finish();
    }, 80);

    const timer = setTimeout(() => finish(), timeoutMs);
  });
}

export function peekNativeDeviceId() {
  return resolveClientIdSync();
}

export function peekFlutterDeviceId() {
  return "";
}

/** @deprecated */
export function getNativeDeviceId(timeoutMs = 3000) {
  return getClientId(timeoutMs);
}

if (typeof window !== "undefined") {
  const earlyUuid =
    window[UUID_KEY] ||
    window.nativeUuid ||
    window.flutterUuid ||
    "";

  window.setNativeUuid = setNativeUuid;
  window.setNativeDeviceId = setNativeDeviceId;
  window.setNativeClientIds = setNativeClientIds;
  window.getClientId = getClientId;
  window.getNativeDeviceId = getNativeDeviceId;

  if (earlyUuid) setNativeUuid(earlyUuid);
  else resolveClientIdSync();
}
