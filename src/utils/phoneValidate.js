/**
 * 美国手机号（北美编号计划 NANP）
 * 10 位：区号 NXX + 局号 NXX + 4 位，N 为 2-9，区号/局号不能是 N11（如 911）。
 */

export const US_PHONE_LENGTH = 10;

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

/** 输入/粘贴归一：只留数字，带国家码 1 的 11 位去掉 1，最多 10 位 */
export function normalizeUsPhoneInput(raw) {
  let digits = normalizePhoneDigits(raw);
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, US_PHONE_LENGTH);
}

export function isValidUsPhone(phone) {
  const p = normalizePhoneDigits(phone);
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(p)) return false;
  const isN11 = (part) => part[1] === "1" && part[2] === "1";
  return !isN11(p.slice(0, 3)) && !isN11(p.slice(3, 6));
}
