/** 去掉国家码里的零宽/不可见字符（接口偶发夹带，会导致路由出现 %E2%80%8C 乱码） */
export function normalizeCountryCode(code) {
  let s = String(code == null ? '' : code)
  try {
    s = decodeURIComponent(s)
  } catch (e) {
    /* already decoded */
  }
  return s
    .replace(
      /[\u200B-\u200D\uFEFF\u2060\u00AD\u180E\u202A-\u202E\u2066-\u2069]/g,
      ''
    )
    .trim()
}

export function readCountryCode() {
  const raw = localStorage.getItem('country')
  const clean = normalizeCountryCode(raw)
  if (raw && clean && raw !== clean) {
    localStorage.setItem('country', clean)
  }
  return clean
}
