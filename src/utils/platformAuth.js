/**
 * 各系统（platform）登录互斥：切换为不同 platform 时须重新登录。
 * 不写死任何平台名，仅比较 localStorage 中的 platform 与即将写入的目标 platform（大小写不敏感）。
 */
var OPEN_LOGIN_FLAG = 'otgame_openLoginAfterPlatformSwitch'

function equalsPlatformId(a, b) {
  return (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase()
}

/**
 * 是否视为「跨系统切换」：前后 platform 均已知且不相同。
 */
export function shouldRequireReloginOnPlatformChange(prevPlatform, nextPlatform) {
  var prev = (prevPlatform || '').trim()
  var next = (nextPlatform || '').trim()
  if (!prev || !next) {
    return false
  }
  return !equalsPlatformId(prev, next)
}

/**
 * 若应重登且存在 token：清除 token 与未支付暂存
 */
export function clearTokenIfReloginRequired(prevPlatform, nextPlatform) {
  if (!shouldRequireReloginOnPlatformChange(prevPlatform, nextPlatform)) {
    return false
  }
  if (!localStorage.getItem('token')) {
    return false
  }
  localStorage.removeItem('token')
  try {
    sessionStorage.removeItem('payOrderData')
  } catch (e) {
    /* ignore */
  }
  return true
}

export function setOpenLoginAfterReloadFlag() {
  try {
    sessionStorage.setItem(OPEN_LOGIN_FLAG, '1')
  } catch (e) {
    /* ignore */
  }
}

export function consumeOpenLoginAfterPlatformSwitch() {
  try {
    if (sessionStorage.getItem(OPEN_LOGIN_FLAG) === '1') {
      sessionStorage.removeItem(OPEN_LOGIN_FLAG)
      return true
    }
  } catch (e) {
    /* ignore */
  }
  return false
}

/**
 * 将整页重载的入口：先清 token 再打标，重载后 index 会弹出登录
 */
export function logoutIfReloginRequiredWithToken(prevPlatform, nextPlatform) {
  var did = clearTokenIfReloginRequired(prevPlatform, nextPlatform)
  if (did) {
    setOpenLoginAfterReloadFlag()
  }
  return did
}
