import { normalizeCountryCode } from "@/utils/country";

/** 与 main.js localeLoaders / src/lang 保持一致 */
export const LOCAL_LOCALES = ["en", "es", "fr", "pt"];

/**
 * 本地国家码 → 默认语言
 * 切换国家时优先走这里，不依赖接口 defaultLanguage（常为 en）
 */
export const COUNTRY_LANG_MAP = {
  US: "en",
  USA: "en",
  UM: "en",
  MX: "es",
  MEX: "es",
  BR: "pt",
  BRA: "pt",
  PT: "pt",
  FR: "fr",
  FRA: "fr",
};

const NAME_LANG_RULES = [
  { re: /mexico|m[eé]xico|\bmx\b|spanish|espa[nñ]ol/i, lang: "es" },
  { re: /brazil|brasil|portug/i, lang: "pt" },
  { re: /france|french|fran[cç]/i, lang: "fr" },
  { re: /america|united\s*states|\busa\b|\bus\b|english/i, lang: "en" },
];

function normalizeLang(code) {
  if (!code) return "";
  const key = String(code).toLowerCase().split(/[-_]/)[0];
  return LOCAL_LOCALES.includes(key) ? key : "";
}

/**
 * 根据平台/国家项解析默认语言（仅返回本地已有语言包）
 * @param {{ country?: string, countryName?: string, defaultLanguage?: string, areaCode?: string, currency?: string }} item
 */
export function resolveCountryLanguage(item = {}) {
  const country = normalizeCountryCode(item.country || "").toUpperCase();
  if (country && COUNTRY_LANG_MAP[country]) {
    return COUNTRY_LANG_MAP[country];
  }

  const name = String(item.countryName || "");
  for (const rule of NAME_LANG_RULES) {
    if (rule.re.test(name)) return rule.lang;
  }

  // 区号 / 币种兜底
  const area = String(item.areaCode || "").replace(/\D/g, "");
  if (area === "52") return "es";
  if (area === "55") return "pt";
  if (area === "33") return "fr";
  if (area === "1") return "en";

  const currency = String(item.currency || item.currencyUnit || "").toUpperCase();
  if (currency === "MXN") return "es";
  if (currency === "BRL") return "pt";
  if (currency === "EUR" && /fr/i.test(name)) return "fr";
  if (currency === "USD") return "en";

  // 接口语言仅当本地有对应语言包时才用
  const fromApi = normalizeLang(item.defaultLanguage);
  if (fromApi) return fromApi;

  return "en";
}

/** 写入切换国家后的默认语言 */
export function applyCountryLanguage(item) {
  const lang = resolveCountryLanguage(item);
  localStorage.setItem("defaultLanguage", lang);
  return lang;
}
