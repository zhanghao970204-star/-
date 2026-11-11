/** 游客登录态本地标记（与 /login/guestLogin、/profile/bindGuest 对齐） */

const IS_GUEST_KEY = "isGuest";
const GUEST_UUID_KEY = "guestUuid";
const GUEST_ACCOUNT_KEY = "guestAccount";

export function isGuestUser() {
  return localStorage.getItem(IS_GUEST_KEY) === "1";
}

export function getGuestUuid() {
  return (localStorage.getItem(GUEST_UUID_KEY) || "").trim();
}

export function saveLoginSession(content = {}, extra = {}) {
  const token = content.accessToken;
  if (token) localStorage.setItem("token", token);

  if (typeof content.isGuest === "boolean") {
    localStorage.setItem(IS_GUEST_KEY, content.isGuest ? "1" : "0");
  } else if (extra.clearGuest) {
    localStorage.setItem(IS_GUEST_KEY, "0");
  }

  const uuid = (extra.uuid || "").trim();
  if (uuid) localStorage.setItem(GUEST_UUID_KEY, uuid);

  if (content.account) {
    localStorage.setItem(GUEST_ACCOUNT_KEY, content.account);
  }
}

export function clearGuestFlags() {
  localStorage.removeItem(IS_GUEST_KEY);
  localStorage.removeItem(GUEST_UUID_KEY);
  localStorage.removeItem(GUEST_ACCOUNT_KEY);
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
