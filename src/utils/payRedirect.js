import { normalizeCountryCode, readCountryCode } from '@/utils/country'

/** 仅美国走新窗口跳转支付，其他国家用弹窗嵌入 iframe */
export function isUsPayRedirect() {
  const stored = readCountryCode()
  const pathPrefix = normalizeCountryCode(
    (window.location.pathname || '').split('/').filter(Boolean)[0] || ''
  )
  const country = (stored || pathPrefix).toUpperCase()
  return country === 'US' || country === 'USA'
}

/** 美国提前打开空白页，避免异步下单后被浏览器拦截弹窗 */
export function openUsPayBlankWindow() {
  if (!isUsPayRedirect()) return null
  try {
    return window.open('about:blank', '_blank')
  } catch (e) {
    return null
  }
}

export function goPayUrl(payWin, url) {
  if (!url) {
    closePayWindow(payWin)
    return
  }
  if (payWin) {
    payWin.location.href = url
  } else {
    window.open(url, '_blank')
  }
}

export function closePayWindow(payWin) {
  if (!payWin) return
  try {
    payWin.close()
  } catch (e) {
    /* ignore */
  }
}
