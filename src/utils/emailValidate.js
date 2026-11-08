/** 中国大陆常见邮箱服务商；子域名（如 vip.qq.com）同样拦截 */
const CN_EMAIL_DOMAINS = [
  "qq.com",
  "foxmail.com",
  "163.com",
  "126.com",
  "yeah.net",
  "188.com",
  "163.net",
  "netease.com",
  "139.com",
  "sina.com",
  "sohu.com",
  "aliyun.com",
  "21cn.com",
  "tom.com",
  "263.net",
  "x263.net",
  "2980.com",
  "eyou.com",
  "china.com",
  "citiz.net",
  "0355.net",
];

const LOCAL_RE = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const DOMAIN_RE = /^([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

export function normalizeEmail(value) {
  return String(value == null ? "" : value).replace(/\s+/g, "");
}

/** 纯格式校验：ASCII、长度、本地部分与域名结构 */
export function isValidEmailFormat(value) {
  const email = normalizeEmail(value);
  if (!email || email.length > 254) return false;
  const at = email.lastIndexOf("@");
  if (at <= 0 || at !== email.indexOf("@")) return false;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (local.length > 64) return false;
  return LOCAL_RE.test(local) && DOMAIN_RE.test(domain);
}

export function isChineseEmail(value) {
  const email = normalizeEmail(value).toLowerCase();
  const domain = email.slice(email.lastIndexOf("@") + 1);
  if (!domain) return false;
  if (domain === "cn" || domain.endsWith(".cn")) return true;
  return CN_EMAIL_DOMAINS.some(
    (d) => domain === d || domain.endsWith(`.${d}`),
  );
}

/** @returns {"" | "empty" | "format" | "cn"} */
export function getEmailErrorType(value) {
  const email = normalizeEmail(value);
  if (!email) return "empty";
  if (!isValidEmailFormat(email)) return "format";
  if (isChineseEmail(email)) return "cn";
  return "";
}

export function isValidEmail(value) {
  return getEmailErrorType(value) === "";
}
