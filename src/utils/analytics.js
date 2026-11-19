/**
 * PostHog 埋点（对齐「游戏数据上报埋点」文档）
 * - 通用属性自动附带；server_* / 纯原生事件不在此上报
 * - 无 API Key 时静默 no-op，不影响业务
 */
import posthog from "posthog-js";
import {
  POSTHOG_HOST,
  POSTHOG_KEY,
  STORAGE_KEYS,
} from "./appConstants";
import { isNativeAppShell } from "./nativeApp";
import { peekFlutterUuid, peekVueLocalUuid } from "./nativeDevice";

const SESSION_KEY = "ph_session_id";
const ANON_KEY = "ph_anon_user_id";
const LAUNCH_KEY = "ph_launch_source";
const GAME_SESSION_KEY = "ph_game_session_id";
const GAME_ENTER_AT_KEY = "ph_game_enter_at";
const DEPOSIT_ENTRY_KEY = "ph_deposit_entry_scene";
const WITHDRAW_ENTRY_KEY = "ph_withdraw_entry_scene";
const LOGIN_ENTRY_KEY = "ph_login_entry_scene";

let ready = false;
let warned = false;
let currentPage = "";
let fromPage = "";

const profile = {
  vip_level: 0,
  coin_balance: 0,
  currency_type: "USD",
  invite_user_id: "",
  user_register_days: 0,
  channel: "",
  ab_test_group: "",
  app_version: "",
};

function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function storageGet(key) {
  try {
    return localStorage.getItem(key) || "";
  } catch (e) {
    return "";
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value == null ? "" : String(value));
  } catch (e) {
    /* ignore */
  }
}

function sessionGet(key) {
  try {
    return sessionStorage.getItem(key) || "";
  } catch (e) {
    return "";
  }
}

function sessionSet(key, value) {
  try {
    sessionStorage.setItem(key, value == null ? "" : String(value));
  } catch (e) {
    /* ignore */
  }
}

function getOrCreateSessionId() {
  let id = sessionGet(SESSION_KEY);
  if (!id) {
    id = uuid();
    sessionSet(SESSION_KEY, id);
  }
  return id;
}

function getAnonId() {
  let id = storageGet(ANON_KEY);
  if (!id) {
    id = peekFlutterUuid() || peekVueLocalUuid() || uuid();
    storageSet(ANON_KEY, id);
  }
  return id;
}

function detectPlatform() {
  if (!isNativeAppShell()) return "h5";
  const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
  if (/android/i.test(ua)) return "android_native";
  return "ios_native";
}

function detectLaunchSource() {
  try {
    const q = new URLSearchParams(window.location.search || "");
    if (q.get("push_id") || q.get("pushId")) return "push";
    if (q.get("deeplink") || q.get("deep_link") || q.get("dl")) return "deep_link";
    if (document.referrer && /luckyhub|localhost/i.test(document.referrer)) {
      return "background_wake";
    }
  } catch (e) {
    /* ignore */
  }
  return "icon";
}

function resolveChannel() {
  try {
    const q = new URLSearchParams(window.location.search || "");
    const utm = q.get("utm_source") || q.get("channel") || "";
    if (utm) return utm;
    const fb = storageGet("fbExpand") || "";
    const m = fb.match(/utm_source=([^&]+)/);
    if (m) return decodeURIComponent(m[1]);
  } catch (e) {
    /* ignore */
  }
  return profile.channel || "";
}

function daysSince(ts) {
  const n = Number(ts);
  if (!n) return 0;
  const ms = n > 1e12 ? n : n * 1000;
  const days = Math.floor((Date.now() - ms) / 86400000);
  return days >= 0 ? days : 0;
}

function money2(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

function resolvePosthogKey() {
  return (
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_POSTHOG_KEY) ||
    POSTHOG_KEY ||
    ""
  );
}

function resolvePosthogHost() {
  let host =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_POSTHOG_HOST) ||
    POSTHOG_HOST ||
    "https://us.i.posthog.com";
  host = String(host || "").trim().replace(/\/$/, "");
  // 控制台域名误填时自动纠正为 ingest
  if (/^https?:\/\/us\.posthog\.com$/i.test(host)) {
    return "https://us.i.posthog.com";
  }
  if (/^https?:\/\/eu\.posthog\.com$/i.test(host)) {
    return "https://eu.i.posthog.com";
  }
  return host || "https://us.i.posthog.com";
}

function hasPosthogKey() {
  return !!resolvePosthogKey();
}

function buildCommonProps() {
  const token = storageGet("token");
  const uid = storageGet("ph_user_id") || (token ? "" : getAnonId());
  return {
    user_id: uid || getAnonId(),
    session_id: getOrCreateSessionId(),
    platform: detectPlatform(),
    app_version: profile.app_version || storageGet("app_version") || "h5",
    channel: resolveChannel(),
    invite_user_id: profile.invite_user_id || storageGet("id") || "",
    vip_level: Number(profile.vip_level) || 0,
    coin_balance: money2(profile.coin_balance),
    currency_type: String(profile.currency_type || "USD").toUpperCase(),
    user_register_days: Number(profile.user_register_days) || 0,
    launch_source: sessionGet(LAUNCH_KEY) || detectLaunchSource(),
    ab_test_group: profile.ab_test_group || "",
    event_trigger_ts: Date.now(),
    page: currentPage || "",
    frompage: fromPage || "",
  };
}

export function initAnalytics() {
  if (ready) return;
  const key = resolvePosthogKey();
  const host = resolvePosthogHost();

  if (!sessionGet(LAUNCH_KEY)) {
    sessionSet(LAUNCH_KEY, detectLaunchSource());
  }

  if (!key) {
    if (import.meta.env.DEV && !warned) {
      warned = true;
      console.warn(
        "[analytics] PostHog key missing. Set VITE_POSTHOG_KEY or POSTHOG_KEY in appConstants.",
      );
    }
    ready = true;
    track(EVENTS.app_launch_event, {
      deep_link_param: window.location.search || "",
      push_id: new URLSearchParams(window.location.search).get("push_id") || "",
    });
    return;
  }

  try {
    posthog.init(key, {
      api_host: host,
      person_profiles: "identified_only",
      capture_pageview: false,
      capture_pageleave: true,
      persistence: "localStorage+cookie",
      autocapture: false,
      // 首页多分类 game_view 瞬时爆发，默认 10/s·burst100 会丢事件并刷红
      rate_limiting: {
        events_per_second: 50,
        events_burst_limit: 500,
      },
    });
    const knownId = storageGet("ph_user_id");
    if (knownId) {
      posthog.identify(String(knownId));
    } else {
      posthog.identify(getAnonId());
    }
    ready = true;
    track(EVENTS.app_launch_event, {
      deep_link_param: window.location.search || "",
      push_id: new URLSearchParams(window.location.search).get("push_id") || "",
    });
  } catch (e) {
    console.error("[analytics] init failed", e);
    ready = true;
  }
}

export function setAnalyticsProfile(partial = {}) {
  if (!partial || typeof partial !== "object") return;
  if (partial.vip_level != null) profile.vip_level = Number(partial.vip_level) || 0;
  if (partial.coin_balance != null) {
    profile.coin_balance = money2(partial.coin_balance);
  }
  if (partial.currency_type) {
    profile.currency_type = String(partial.currency_type).toUpperCase();
  }
  if (partial.invite_user_id != null) {
    profile.invite_user_id = String(partial.invite_user_id || "");
  }
  if (partial.user_register_days != null) {
    profile.user_register_days = Number(partial.user_register_days) || 0;
  }
  if (partial.channel != null) profile.channel = String(partial.channel || "");
  if (partial.ab_test_group != null) {
    profile.ab_test_group = String(partial.ab_test_group || "");
  }
  if (partial.app_version != null) {
    profile.app_version = String(partial.app_version || "");
  }
  if (partial.register_time != null) {
    profile.user_register_days = daysSince(partial.register_time);
  }
}

/** 从 Init / GameBalanceList 回包同步通用属性 */
export function syncAnalyticsFromInit(content) {
  if (!content || typeof content !== "object") return;
  const uid = content._uid ?? content.uid ?? content.userId ?? content.user_id;
  if (uid != null && String(uid)) {
    identifyAnalyticsUser(String(uid));
  }
  setAnalyticsProfile({
    vip_level: content.vipLevel,
    invite_user_id: content.inviterId || content.inviteUserId || storageGet("id"),
    currency_type: content.currency || content.currencyType || profile.currency_type,
    register_time:
      content.registerTime ||
      content.regTime ||
      content.createTime ||
      content.createdAt,
  });
}

export function syncAnalyticsBalance(content) {
  if (!content || typeof content !== "object") return;
  const bal =
    content.totalBalance != null ? content.totalBalance : content.balance;
  setAnalyticsProfile({
    coin_balance: bal,
    currency_type: content.currency || profile.currency_type,
  });
}

export function identifyAnalyticsUser(userId) {
  if (!userId) return;
  storageSet("ph_user_id", String(userId));
  try {
    if (hasPosthogKey()) posthog.identify(String(userId));
  } catch (e) {
    /* ignore */
  }
}

export function resetAnalyticsUser() {
  try {
    localStorage.removeItem("ph_user_id");
  } catch (e) {
    /* ignore */
  }
  try {
    if (hasPosthogKey()) {
      posthog.reset();
      posthog.identify(getAnonId());
    }
  } catch (e) {
    /* ignore */
  }
}

export function setAnalyticsPage(pageName) {
  if (!pageName || pageName === currentPage) return;
  fromPage = currentPage || "";
  currentPage = pageName;
}

export function getAnalyticsPage() {
  return currentPage;
}

export function track(event, props = {}) {
  if (!event) return;
  if (!ready) initAnalytics();
  const payload = { ...buildCommonProps(), ...(props || {}) };
  try {
    if (hasPosthogKey()) {
      posthog.capture(event, payload);
    } else if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", event, payload);
    }
  } catch (e) {
    /* ignore */
  }
}

export function setDepositEntryScene(scene) {
  sessionSet(DEPOSIT_ENTRY_KEY, scene || "");
}

export function getDepositEntryScene() {
  return sessionGet(DEPOSIT_ENTRY_KEY) || "";
}

export function setWithdrawEntryScene(scene) {
  sessionSet(WITHDRAW_ENTRY_KEY, scene || "");
}

export function getWithdrawEntryScene() {
  return sessionGet(WITHDRAW_ENTRY_KEY) || "";
}

export function setLoginEntryScene(scene) {
  sessionSet(LOGIN_ENTRY_KEY, scene || "");
}

export function getLoginEntryScene() {
  return (
    sessionGet(LOGIN_ENTRY_KEY) ||
    sessionGet("loginScene") ||
    storageGet("loginScene") ||
    ""
  );
}

export function beginGameSession(gameId) {
  const sid = uuid();
  sessionSet(GAME_SESSION_KEY, sid);
  sessionSet(GAME_ENTER_AT_KEY, String(Date.now()));
  sessionSet("ph_game_id", String(gameId || ""));
  return sid;
}

export function getGameSessionId() {
  return sessionGet(GAME_SESSION_KEY) || "";
}

export function getGameDurationMs() {
  const at = Number(sessionGet(GAME_ENTER_AT_KEY)) || 0;
  if (!at) return 0;
  return Math.max(0, Date.now() - at);
}

export function clearGameSession() {
  try {
    sessionStorage.removeItem(GAME_SESSION_KEY);
    sessionStorage.removeItem(GAME_ENTER_AT_KEY);
    sessionStorage.removeItem("ph_game_id");
  } catch (e) {
    /* ignore */
  }
}

/** 路由名 → 页面曝光事件（无映射则只更新 page/frompage） */
export const PAGE_VIEW_EVENTS = {
  Home: "home_page_page_view",
  RechargeCont: "deposit_page_page_view",
  Mine: "wallet_page_page_view",
  Activity: "activity_center_page_view",
  Share: "invite_page_page_view",
  DailyCheckIn: "checkin_page_page_view",
  LuckyReferral: "lucky_roulette_page_view",
  RedPacket: "red_packet_page_view",
  WeeklyMissions: "mission_center_page_view",
  VipLevels: "vip_page_page_view",
  BankAdd: "withdraw_page_page_view",
  SetPassWord: "withdraw_password_set_page_view",
  Bank: "withdraw_account_bind_page_view",
  AuthName: "withdraw_account_bind_page_view",
  GameHall: "game_loading_page_view",
};

/** 活动详情页：统一补 activity_detail_page_view */
const ACTIVITY_DETAIL_BY_ROUTE = {
  RedPacket: { activity_id: "envelope", activity_type: "envelope" },
  LuckyReferral: { activity_id: "spin", activity_type: "spin" },
  DailyCheckIn: { activity_id: "checkin", activity_type: "checkin" },
  WeeklyMissions: { activity_id: "loss", activity_type: "loss" },
  VipLevels: { activity_id: "vip", activity_type: "vip" },
  NewbieGift: { activity_id: "deposit", activity_type: "deposit" },
};

export const EVENTS = {
  app_launch_event: "app_launch_event",
  login_page_page_view: "login_page_page_view",
  login_page_login_submit: "login_page_login_submit",
  login_page_login_success: "login_page_login_success",
  login_page_login_fail: "login_page_login_fail",
  register_page_page_view: "register_page_page_view",
  register_page_register_submit: "register_page_register_submit",
  register_page_register_success: "register_page_register_success",
  home_page_page_view: "home_page_page_view",
  home_page_tab_click: "home_page_tab_click",
  home_page_banner_view: "home_page_banner_view",
  home_page_banner_click: "home_page_banner_click",
  home_page_search_click: "home_page_search_click",
  home_page_category_click: "home_page_category_click",
  home_page_game_view: "home_page_game_view",
  home_page_game_click: "home_page_game_click",
  home_page_favorite_click: "home_page_favorite_click",
  game_recommend_exposure: "game_recommend_exposure",
  game_recommend_click: "game_recommend_click",
  game_loading_page_view: "game_loading_page_view",
  game_webview_load_success: "game_webview_load_success",
  game_webview_load_fail: "game_webview_load_fail",
  game_page_exit_click: "game_page_exit_click",
  wallet_page_page_view: "wallet_page_page_view",
  wallet_page_tab_click: "wallet_page_tab_click",
  deposit_entry_click: "deposit_entry_click",
  deposit_page_page_view: "deposit_page_page_view",
  deposit_page_amount_click: "deposit_page_amount_click",
  deposit_page_pay_channel_click: "deposit_page_pay_channel_click",
  deposit_page_pay_submit: "deposit_page_pay_submit",
  deposit_webview_return: "deposit_webview_return",
  withdraw_entry_click: "withdraw_entry_click",
  withdraw_password_set_page_view: "withdraw_password_set_page_view",
  withdraw_password_set_submit: "withdraw_password_set_submit",
  withdraw_account_bind_page_view: "withdraw_account_bind_page_view",
  withdraw_account_bind_submit: "withdraw_account_bind_submit",
  withdraw_page_page_view: "withdraw_page_page_view",
  withdraw_balance_limit_tip_view: "withdraw_balance_limit_tip_view",
  withdraw_page_submit_click: "withdraw_page_submit_click",
  withdraw_abandon_click: "withdraw_abandon_click",
  activity_center_page_view: "activity_center_page_view",
  activity_center_activity_click: "activity_center_activity_click",
  activity_detail_page_view: "activity_detail_page_view",
  activity_detail_join_click: "activity_detail_join_click",
  activity_reward_claim_click: "activity_reward_claim_click",
  checkin_page_page_view: "checkin_page_page_view",
  checkin_page_free_checkin_click: "checkin_page_free_checkin_click",
  checkin_page_pay_checkin_click: "checkin_page_pay_checkin_click",
  new_player_register_giftpack_popup_view:
    "new_player_register_giftpack_popup_view",
  new_player_register_giftpack_popup_click:
    "new_player_register_giftpack_popup_click",
  new_player_register_giftpack_floating_window_view:
    "new_player_register_giftpack_floating_window_view",
  new_player_register_giftpack_floating_window_click:
    "new_player_register_giftpack_floating_window_click",
  new_player_register_giftpack_floating_window_close:
    "new_player_register_giftpack_floating_window_close",
  new_player_giftpack_popup_view: "new_player_giftpack_popup_view",
  new_player_giftpack_buy_click: "new_player_giftpack_buy_click",
  treasure_box_popup_view: "treasure_box_popup_view",
  treasure_box_buy_click: "treasure_box_buy_click",
  red_packet_popup_view: "red_packet_popup_view",
  red_packet_popup_click: "red_packet_popup_click",
  red_packet_popup_close: "red_packet_popup_close",
  red_packet_page_view: "red_packet_page_view",
  red_packet_claim_click: "red_packet_claim_click",
  lucky_roulette_popup_view: "lucky_roulette_popup_view",
  lucky_roulette_popup_click: "lucky_roulette_popup_click",
  lucky_roulette_page_view: "lucky_roulette_page_view",
  lucky_roulette_spin_click: "lucky_roulette_spin_click",
  mission_center_page_view: "mission_center_page_view",
  mission_reward_claim_click: "mission_reward_claim_click",
  invite_page_page_view: "invite_page_page_view",
  invite_page_copy_link_click: "invite_page_copy_link_click",
  invite_page_share_click: "invite_page_share_click",
  invite_team_report_page_view: "invite_team_report_page_view",
  invite_subordinate_page_view: "invite_subordinate_page_view",
  invite_treasure_page_view: "invite_treasure_page_view",
  invite_treasure_claim_click: "invite_treasure_claim_click",
  vip_page_page_view: "vip_page_page_view",
  vip_level_reward_claim_click: "vip_level_reward_claim_click",
  vip_daily_checkin_click: "vip_daily_checkin_click",
  vip_birthday_reward_claim_click: "vip_birthday_reward_claim_click",
  cs_click: "cs_click",
};

export function trackRoutePageView(route) {
  if (!route) return;
  const name = route.name || "";
  setAnalyticsPage(name || route.path || "");
  const event = PAGE_VIEW_EVENTS[name];

  if (event) {
    const extra = {};
    if (name === "Home") {
      /* empty */
    } else if (name === "RechargeCont") {
      extra.entry_scene = getDepositEntryScene() || "direct";
    } else if (name === "Activity") {
      extra.entry_scene = "tab";
    } else if (name === "Share") {
      extra.tab_type = "rule_share";
    } else if (name === "LuckyReferral") {
      extra.entry_scene = "page";
    } else if (name === "SetPassWord") {
      extra.entry_scene = getWithdrawEntryScene() || "withdraw";
    } else if (name === "GameHall") {
      const gid = (route.query && route.query.gid) || sessionGet("ph_game_id");
      let sid = getGameSessionId();
      if (!sid) sid = beginGameSession(gid);
      extra.game_id = gid;
      extra.game_session_id = sid;
    } else if (name === "SearchGame") {
      // search page open also counts as search entry; keyword filled on submit
      extra.search_keyword = "";
    } else if (name === "WeeklyMissions") {
      extra.tab_type = "weekly";
    }

    track(event, extra);
  }

  const detail = ACTIVITY_DETAIL_BY_ROUTE[name];
  if (detail) {
    track(EVENTS.activity_detail_page_view, {
      activity_id: detail.activity_id,
      activity_type: detail.activity_type,
      entry_scene: "activity_list",
    });
  }
}

// silence unused import warning if STORAGE_KEYS unused later
void STORAGE_KEYS;
