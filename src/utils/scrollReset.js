/**
 * 全局滚动重置：兼容 window / body / #app / #app-content / 页面内可滚动容器
 */
const KNOWN_SCROLL_IDS = ['app', 'app-content']
const KNOWN_SCROLL_SELECTORS = [
  '.mine-page',
  '.rc-page',
  '.home-page',
  '.share-page',
  '.activity-page',
  '.lucky-referral',
  '.content',
  '.van-popup__content',
  '[data-scroll-root]'
]

function isScrollable(el) {
  if (!el || el.nodeType !== 1) return false
  const style = window.getComputedStyle(el)
  const overflowY = style.overflowY
  const canScrollY =
    (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
    el.scrollHeight > el.clientHeight + 1
  return canScrollY || el.scrollTop > 0
}

function scrollElToTop(el) {
  if (!el) return
  try {
    if (typeof el.scrollTo === 'function') {
      el.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    }
  } catch (e) {
    try {
      el.scrollTo(0, 0)
    } catch (err) {
      /* ignore */
    }
  }
  if ('scrollTop' in el) el.scrollTop = 0
  if ('scrollLeft' in el) el.scrollLeft = 0
}

export function resetPageScroll() {
  try {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  } catch (e) {
    /* ignore */
  }

  try {
    window.scrollTo(0, 0)
  } catch (e) {
    /* ignore */
  }

  if (document.documentElement) {
    document.documentElement.scrollTop = 0
    document.documentElement.scrollLeft = 0
  }
  if (document.body) {
    document.body.scrollTop = 0
    document.body.scrollLeft = 0
  }

  KNOWN_SCROLL_IDS.forEach((id) => {
    scrollElToTop(document.getElementById(id))
  })

  KNOWN_SCROLL_SELECTORS.forEach((sel) => {
    document.querySelectorAll(sel).forEach(scrollElToTop)
  })

  // 兜底：扫描当前可见的可滚动节点（避免漏掉局部容器）
  try {
    const all = document.querySelectorAll('div, main, section, article')
    for (let i = 0; i < all.length; i++) {
      const el = all[i]
      if (el.scrollTop > 0 && isScrollable(el)) {
        scrollElToTop(el)
      }
    }
  } catch (e) {
    /* ignore */
  }
}

let _resetTimerIds = []

function clearResetTimers() {
  _resetTimerIds.forEach((id) => clearTimeout(id))
  _resetTimerIds = []
}

/** 路由切换后多拍几次，覆盖异步渲染 / keep-alive / 过渡动画 */
export function resetPageScrollAfterRoute() {
  clearResetTimers()
  resetPageScroll()

  const delays = [0, 16, 50, 100, 200, 350, 500]
  delays.forEach((ms) => {
    const id = setTimeout(() => {
      resetPageScroll()
    }, ms)
    _resetTimerIds.push(id)
  })

  requestAnimationFrame(() => {
    resetPageScroll()
    requestAnimationFrame(resetPageScroll)
  })
}
