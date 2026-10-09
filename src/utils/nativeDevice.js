/**
 * 客户端唯一标识（传后端 uuid）
 *
 * 优先级：
 * 1. Flutter 注入的 uuid
 * 2. Vue 本地 uuid（指纹）
 *
 * Flutter onPageFinished：
 *   window.setNativeUuid('flutter-uuid');
 * 或：
 *   window.setNativeClientIds({ uuid: 'flutter-uuid' });
 */

import { STORAGE_KEYS } from './appConstants';

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

export function peekVueLocalUuid() {
  try {
    if (window.fingerprint) return norm(window.fingerprint);
    if (typeof localStorage !== "undefined") {
      return (
        norm(localStorage.getItem(STORAGE_KEYS.fingerprint)) ||
        norm(localStorage.getItem("vue_guest_uuid")) ||
        ""
      );
    }
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

/** 同步：Flutter uuid → Vue 本地 uuid */
export function resolveClientIdSync() {
  const fromQuery = readQueryUuid();
  if (fromQuery) setNativeUuid(fromQuery);

  return peekFlutterUuid() || peekVueLocalUuid() || ensureLocalUuid() || "";
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
