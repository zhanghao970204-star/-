/** 游客登录态本地标记（与 /login/guestLogin、/profile/bindGuest 对齐） */

import { isNativeAppShell } from "@/utils/nativeApp";

const IS_GUEST_KEY = "isGuest";
const GUEST_UUID_KEY = "guestUuid";
const GUEST_ACCOUNT_KEY = "guestAccount";
const AUTH_KEYS = [
  "token",
  "shareCode",
  IS_GUEST_KEY,
  GUEST_UUID_KEY,
  GUEST_ACCOUNT_KEY,
  "ph_user_id",
];

function hasNativeBridge() {
  return (
    typeof window !== "undefined" &&
    window.NativeBridge &&
    typeof window.NativeBridge.postMessage === "function"
  );
}

export function isGuestUser() {
  return localStorage.getItem(IS_GUEST_KEY) === "1";
}

export function getGuestUuid() {
  return (localStorage.getItem(GUEST_UUID_KEY) || "").trim();
}

/**
 * 统一写入登录态。App 内 localStorage.setItem 已被 hook，会 sync 到 SharedPreferences / boot。
 * 禁止业务侧再裸写 localStorage.token。
 */
export function saveLoginSession(content = {}, extra = {}) {
  const token = content.accessToken;
  if (token) localStorage.setItem("token", token);

  if (typeof content.isGuest === "boolean") {
    localStorage.setItem(IS_GUEST_KEY, content.isGuest ? "1" : "0");
  } else if (extra.clearGuest) {
    localStorage.setItem(IS_GUEST_KEY, "0");
  }

  if (extra.clearGuest || content.isGuest === false) {
    try {
      localStorage.removeItem(GUEST_UUID_KEY);
    } catch (_) {
      /* ignore */
    }
  }

  const uuid = (extra.uuid || "").trim();
  if (uuid) localStorage.setItem(GUEST_UUID_KEY, uuid);

  if (content.account) {
    localStorage.setItem(GUEST_ACCOUNT_KEY, content.account);
  } else if (extra.clearGuest || content.isGuest === false) {
    try {
      localStorage.removeItem(GUEST_ACCOUNT_KEY);
    } catch (_) {
      /* ignore */
    }
  }
}

export function clearGuestFlags() {
  localStorage.removeItem(IS_GUEST_KEY);
  localStorage.removeItem(GUEST_UUID_KEY);
  localStorage.removeItem(GUEST_ACCOUNT_KEY);
}

/** 仅清 H5 localStorage 登录态（App 下 removeItem 会顺带 storageRemove） */
export function clearAuthSession() {
  AUTH_KEYS.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch (_) {
      /* ignore */
    }
  });
  clearGuestFlags();
}

/**
 * 通知 Flutter 清 SharedPreferences + 重写 boot。
 * reload=true：原生再 loadRequest 回首页（退出/改密/忘记密码）。
 * reload=false：只清存储，不导航（账号被挤 need_login，由 H5 弹登录）。
 */
export function notifyNativeClearAuth({ reload = false } = {}) {
  if (!isNativeAppShell() || !hasNativeBridge()) return false;
  try {
    window.NativeBridge.postMessage(
      JSON.stringify({ action: "clearAuth", reload: !!reload }),
    );
    return true;
  } catch (_) {
    return false;
  }
}

/** 清 H5 + 通知原生（不强制整页刷新）— 账号被挤 / 跨系统切平台 */
export function clearAuthLocalAndNative({ reload = false } = {}) {
  clearAuthSession();
  notifyNativeClearAuth({ reload });
}

/**
 * App：清存储后由原生 loadRequest 回首页（reload:true）。
 * H5：清本地后刷新。
 * 杀进程重进后写 boot 较慢，切勿过早 reload。
 */
export function clearAuthAndReload() {
  clearAuthSession();
  const go = () => reloadAppEntry();
  if (isNativeAppShell() && hasNativeBridge()) {
    let done = false;
    const startHref =
      typeof location !== "undefined" ? location.href : "";
    const finish = () => {
      if (done) return;
      done = true;
      try {
        window.__onNativeAuthCleared = null;
      } catch (_) {
        /* ignore */
      }
      try {
        if (startHref && location.href !== startHref) return;
      } catch (_) {
        /* ignore */
      }
      go();
    };
    try {
      window.__NATIVE_AUTH_CLEAR_DONE = 0;
      window.__onNativeAuthCleared = finish;
      window.NativeBridge.postMessage(
        JSON.stringify({ action: "clearAuth", reload: true }),
      );
    } catch (_) {
      finish();
      return;
    }
    setTimeout(finish, 5000);
    return;
  }
  go();
}

/**
 * 登录成功后刷新入口页。
 * history 模式下当前 URL 常为 /US/home，直接 reload 在本地 WebView 静态服务上会 404 白屏。
 */
export function reloadAppEntry() {
  try {
    const { origin, pathname } = window.location;
    if (pathname && pathname !== "/" && !/\.html?$/i.test(pathname)) {
      window.location.replace(`${origin}/index.html`);
      return;
    }
  } catch (_) {
    /* ignore */
  }
  window.location.reload();
}

// 登录成功后要回到的页面（登录成功会整页刷新，刷新后由路由守卫跳回）
const AFTER_LOGIN_KEY = "afterLoginPath";

export function setAfterLoginPath(path) {
  if (!path) return;
  try {
    sessionStorage.setItem(
      AFTER_LOGIN_KEY,
      JSON.stringify({ path: String(path), at: Date.now() }),
    );
  } catch (_) {
    /* ignore */
  }
}

export function readAfterLoginPath() {
  try {
    const raw = JSON.parse(sessionStorage.getItem(AFTER_LOGIN_KEY) || "null");
    return raw && raw.path ? raw : null;
  } catch (_) {
    return null;
  }
}

export function clearAfterLoginPath() {
  try {
    sessionStorage.removeItem(AFTER_LOGIN_KEY);
  } catch (_) {
    /* ignore */
  }
}
