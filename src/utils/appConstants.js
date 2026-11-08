// Only immutable defaults and key names live here. Read user values at call time.
export const DEFAULT_LOCALE = 'en'
export const STORAGE_KEYS = Object.freeze({
  language: 'defaultLanguage',
  fingerprint: 'ot_fp_vid',
  adjustWebUuid: 'adjust_web_uuid',
  // getIsFbReport 返回 target 为 "ad" 时为 "1"：H5 请求 uuid 改用 Adjust web_uuid
  adjustUuidMode: 'adjust_uuid_mode',
})
export const API_ORIGIN = 'https://us.luckyhubx.cc'
export const API_PATH = '/a/'
export const API_TIMEOUT_MS = 60000
export const DEFAULT_PLATFORM = 'usbet'
export const DEFAULT_CURRENCY = 'usd'

// getIsFbReport 未下发 Adjust 应用识别码（target 非 "ad"）时使用的默认 H5 应用识别码（luckyhub-H5）；事件由后端上报
export const ADJUST_APP_TOKEN = 'dghx072tiy9s'
