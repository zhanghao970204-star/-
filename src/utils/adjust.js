import { ADJUST_APP_TOKEN, STORAGE_KEYS } from './appConstants'
import { isNativeAppShell } from './nativeApp'

/**
 * 事件由后端 S2S 上报；前端只负责初始化 SDK 拿到 adid，拼进注册入参 fbExpand 传给后端。
 * 流程：分享链接 ?id= → getIsFbReport → target 为 "ad" 时 fbPixId 即 Adjust 应用识别码 → 初始化 SDK 拿 adid。
 */

const WEB_UUID_KEY = STORAGE_KEYS.adjustWebUuid
const ADID_KEY = 'adjust_adid'
const APP_TOKEN_KEY = 'adjust_app_token'
const SDK_STORAGE_NAME = 'adjust-sdk'

let sdkPromise = null
let attributionPromise = null

/** App 壳内应由原生 Adjust SDK 归因，H5 SDK 只在浏览器里跑，避免重复计数 */
export function isAdjustEnabled() {
  return !isNativeAppShell()
}

/** 邀请码取分享链接上的 ?id=，没有再用之前存下的 */
function getInviteCode() {
  const match = window.location.href.match(/[?&]id=([^&#]+)/)
  if (match) return decodeURIComponent(match[1])
  return localStorage.getItem('id') || ''
}

async function resolveAppToken() {
  const { GetIsFbReport } = await import('@/api/common')
  try {
    const res = await GetIsFbReport({ inviteCode: getInviteCode() })
    const content = res && res.status === 'ok' ? res.content : null
    const isAdTarget = !!(content && content.target === 'ad' && content.fbPixId)
    // ad 类型：请求 uuid 改用 Adjust web_uuid；否则继续用指纹 ID
    if (isAdTarget) {
      localStorage.setItem(STORAGE_KEYS.adjustUuidMode, '1')
      return String(content.fbPixId)
    }
    if (content) localStorage.removeItem(STORAGE_KEYS.adjustUuidMode)
  } catch (e) {
    /* ignore */
  }
  return ADJUST_APP_TOKEN
}

function deleteSdkDatabase() {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.deleteDatabase(SDK_STORAGE_NAME)
      req.onsuccess = req.onerror = req.onblocked = () => resolve()
    } catch (e) {
      resolve()
    }
  })
}

/** SDK 会缓存上一个应用的设备状态；换了应用识别码必须清掉，否则拿到的还是旧 adid */
async function resetIfAppTokenChanged(appToken) {
  if (localStorage.getItem(APP_TOKEN_KEY) === appToken) return
  localStorage.removeItem(ADID_KEY)
  localStorage.removeItem(WEB_UUID_KEY)
  Object.keys(localStorage)
    .filter((key) => key.startsWith(SDK_STORAGE_NAME))
    .forEach((key) => localStorage.removeItem(key))
  await deleteSdkDatabase()
  localStorage.setItem(APP_TOKEN_KEY, appToken)
}

async function prepareSdk() {
  const appToken = await resolveAppToken()
  if (!appToken) return [appToken, null]
  await resetIfAppTokenChanged(appToken)
  const { default: Adjust } = await import('@adjustcom/adjust-web-sdk')
  return [appToken, Adjust]
}

function loadSdk() {
  if (!isAdjustEnabled()) return Promise.resolve(null)
  if (sdkPromise) return sdkPromise
  sdkPromise = prepareSdk()
    .then(([appToken, Adjust]) => {
      if (!appToken || !Adjust) return null
      const isDev = import.meta.env.DEV
      Adjust.initSdk({
        appToken,
        environment: isDev ? 'sandbox' : 'production',
        logLevel: isDev ? 'verbose' : 'error',
      })
      Adjust.waitForWebUUID()
        .then((uuid) => {
          if (uuid) localStorage.setItem(WEB_UUID_KEY, uuid)
        })
        .catch(() => {})
      attributionPromise = Adjust.waitForAttribution()
        .then((attribution) => {
          const adid = (attribution && attribution.adid) || ''
          if (adid) localStorage.setItem(ADID_KEY, adid)
          if (isDev) console.log('[Adjust] appToken:', appToken, 'adid:', adid)
          return adid
        })
        .catch(() => '')
      return Adjust
    })
    .catch((err) => {
      console.error('[Adjust] init failed', err)
      sdkPromise = null
      return null
    })
  return sdkPromise
}

export function initAdjust() {
  return loadSdk()
}

export function getAdjustWebUUID() {
  return localStorage.getItem(WEB_UUID_KEY) || ''
}

export function getAdjustAdid() {
  return localStorage.getItem(ADID_KEY) || ''
}

/** 注册入参 fbExpand 追加 adid：id=jrc9a9u5 → id=jrc9a9u5&adid=xxx */
export function appendAdidToFbExpand(fbExpand, adid) {
  const parts = String(fbExpand || '')
    .split('&')
    .filter((p) => p && !p.startsWith('adid='))
  if (adid) parts.push(`adid=${adid}`)
  return parts.join('&')
}

/**
 * 取 adid 传给后端；首次打开时归因可能还没完成，最多等 timeoutMs，超时返回空串
 */
export function waitForAdjustAdid(timeoutMs = 3000) {
  if (!isAdjustEnabled()) return Promise.resolve('')
  // 先等本次链接的应用识别码确认完（可能清掉旧 adid），再读缓存
  const task = loadSdk().then(() => getAdjustAdid() || attributionPromise || '')
  const timeout = new Promise((resolve) => setTimeout(() => resolve(''), timeoutMs))
  return Promise.race([task, timeout])
}
