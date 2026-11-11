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
  if (payWin && !payWin.closed) {
    try {
      payWin.location.href = url
      return
    } catch (e) {
      /* fall through */
    }
  }
  let win = null
  try {
    win = window.open(url, '_blank')
  } catch (e) {
    win = null
  }
  // 弹窗被浏览器拦截：订单已生成，给用户一个手动「继续支付」按钮（点击属于用户手势，不会再被拦）
  if (!win) showContinuePay(url)
}

function showContinuePay(url) {
  if (typeof document === 'undefined') return
  const old = document.getElementById('continue-pay-bar')
  if (old) old.remove()
  const bar = document.createElement('div')
  bar.id = 'continue-pay-bar'
  bar.style.cssText =
    'position:fixed;left:50%;bottom:calc(90px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);' +
    'z-index:3500;width:calc(100% - 32px);max-width:418px;box-sizing:border-box;padding:14px 16px;' +
    'border-radius:16px;background:#2d1545;border:1px solid rgba(233,182,90,0.45);' +
    'box-shadow:0 8px 24px rgba(0,0,0,0.45);color:#e6d4f8;font-size:13px;line-height:1.5;text-align:center;'
  const text = document.createElement('p')
  text.style.cssText = 'margin:0 0 10px;'
  text.textContent =
    'Your order has been created. Your browser blocked the payment window.'
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.rel = 'noopener'
  link.textContent = 'Continue to pay'
  link.style.cssText =
    'display:block;height:44px;line-height:44px;border-radius:999px;font-size:15px;font-weight:800;' +
    'color:#fff;text-decoration:none;background:linear-gradient(180deg,#38de98 0%,#02a460 100%);'
  link.addEventListener('click', () => setTimeout(() => bar.remove(), 300))
  const close = document.createElement('button')
  close.type = 'button'
  close.textContent = 'Close'
  close.style.cssText =
    'margin-top:8px;border:none;background:transparent;color:#c9b3ff;font-size:12px;cursor:pointer;'
  close.addEventListener('click', () => bar.remove())
  bar.appendChild(text)
  bar.appendChild(link)
  bar.appendChild(close)
  document.body.appendChild(bar)
}

export function closePayWindow(payWin) {
  if (!payWin) return
  try {
    payWin.close()
  } catch (e) {
    /* ignore */
  }
}
