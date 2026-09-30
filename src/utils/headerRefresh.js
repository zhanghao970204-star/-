import bus from "@/utils/eventBus";

/** 与历史兼容：TopNav / mine 监听此事件刷新头部信息 */
export const HEADER_REFRESH_EVENT = "refsh-amount";

/**
 * 资金/奖励/邮件状态会变的接口（成功后触发头部刷新）
 * 排除 Init / List / Record 等查询类，避免与刷新请求互相触发
 */
const REFRESH_URL_RE =
  /(?:receive|claim|signDaily|\/signIn(?:$|\?)|\/getVipAward(?:$|\?)|getCashBack|getRedPacket(?:$|\?)|\/recharge\/pay|\/recharge\/upayStatus|\/withdraw\/withdraw|betV2|\/luckyRoulette(?:$|\?)|\/setHeadUrl|notice\/readAll|noticeDetails|\/redPacket(?:$|\?))/i;

const EXCLUDE_URL_RE =
  /(?:Init|List|Record|History|getSignIn|getSignDaily|getVipAwardInit|getRegisterAward|getLuckyRoulette(?:$|\?)|BalanceList|profile\/init|treasureReceiveInit|redPacketReceiveRecord|getLuckyRouletteLatestAwards|getLuckyRouletteRecord)/i;

let debounceTimer = null;

export function shouldRefreshHeader(url = "") {
  const path = String(url || "").split("?")[0];
  if (!path) return false;
  if (EXCLUDE_URL_RE.test(path)) return false;
  return REFRESH_URL_RE.test(path);
}

/** 通知头部（余额 / VIP / 邮件等）刷新；默认防抖，避免连点多次打接口 */
export function emitHeaderRefresh({ immediate = false } = {}) {
  if (immediate) {
    bus.emit(HEADER_REFRESH_EVENT);
    return;
  }
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    bus.emit(HEADER_REFRESH_EVENT);
  }, 280);
}
