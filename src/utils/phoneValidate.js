/**
 * 美国手机号校验（注册）
 * 合法：10 位纯数字，或 11 位且以 0 开头；否则无效。
 */

export function normalizeAreaCodeDigits(areaCode) {
  return String(areaCode == null ? "" : areaCode).replace(/\D/g, "");
}

/** 区号是否为美国 +1 */
export function isUsAreaCode(areaCode, country) {
  if (normalizeAreaCodeDigits(areaCode) === "1") return true;
  const c = String(country == null ? "" : country)
    .trim()
    .toUpperCase();
  return c === "US" || c === "USA";
}

export function normalizePhoneDigits(phone) {
  return String(phone == null ? "" : phone).replace(/\D/g, "");
}

/** 美国手机号：10 位，或 11 位且以 0 开头 */
export function isValidUsPhone(phone) {
  const p = normalizePhoneDigits(phone);
  if (/^\d{10}$/.test(p)) return true;
  if (/^0\d{10}$/.test(p)) return true;
  return false;
}
