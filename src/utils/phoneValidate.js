/**
 * 美国手机号：10 位，区号必须是已分配给美国的号段。
 * +1 由美国、加拿大、加勒比共用，格式规则区分不了，用 libphonenumber 号段数据判断归属。
 */

import { parsePhoneNumberFromString } from "libphonenumber-js/min";

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
  const parsed = parsePhoneNumberFromString(p, "US");
  return !!parsed && parsed.isValid() && parsed.country === "US";
}
