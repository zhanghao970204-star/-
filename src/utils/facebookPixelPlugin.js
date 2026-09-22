let fb_dynamic_pixelId = ''

const initUrl = window.location.href

function getUrlIDParams() {
  const queryString = initUrl.match(/[?&]id=([^&]+)/)
  if (queryString && queryString[1]) {
    return queryString[1]
  }
  return ''
}

function getUrlFBParams() {
  const questionMarkIndex = initUrl.indexOf('?')
  const queryString =
    questionMarkIndex !== -1 ? initUrl.substring(questionMarkIndex + 1) : ''
  return queryString
}

let fbScriptRequested = false

function ensureFbqStub() {
  if (window.fbq) return
  window.fbq = function () {
    window.fbq.callMethod
      ? window.fbq.callMethod.apply(window.fbq, arguments)
      : window.fbq.queue.push(arguments)
  }
  if (!window._fbq) window._fbq = window.fbq
  window.fbq.push = window.fbq
  window.fbq.loaded = true
  window.fbq.version = '2.0'
  window.fbq.queue = []
}

/** 仅在真正有 pixelId 时再拉 FB SDK，避免 connect.facebook.net 超时拖住标签页转圈 */
function initFacebookPixel() {
  if (fbScriptRequested) return
  fbScriptRequested = true
  ensureFbqStub()

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  script.onerror = () => {
    // 网络不可达时静默失败，不影响首屏
  }
  document.head.appendChild(script)
}

function callTrack(track, name) {
  if (window.fbq) {
    window.fbq(track, name)
    console.log('callTrack:', { track, name })
  }
}

function callTrackHasPara(track, name, valueData, currencyData) {
  if (window.fbq) {
    window.fbq(track, name, { value: valueData, currency: currencyData })
    console.log('callTrackHasPara:', { name, valueData, currencyData })
  }
}

function getFbId() {
  return fb_dynamic_pixelId || ''
}

function setFbId(pixelId) {
  if (!pixelId) return
  if (pixelId !== fb_dynamic_pixelId) {
    fb_dynamic_pixelId = pixelId
    initFacebookPixel()
    if (window.fbq) {
      window.fbq('init', pixelId)
      console.log('pixelId:', pixelId)
    }
  }
}

function sendEventToAndroid(eventData) {
  try {
    console.log('eventData to Android:', eventData)
    if (window.AndroidInterface && window.AndroidInterface.appsFlyerEvent) {
      window.AndroidInterface.appsFlyerEvent(eventData)
      console.log('发送事件 to Android:', eventData)
    }
  } catch (error) {
    console.error('Error sending event to Android:', error)
  }
}

function callAppsFlyer(eventData) {
  sendEventToAndroid(eventData)
}

const FacebookPixelPlugin = {
  install(app) {
    // 不在启动时拉 FB SDK；等 setFbId 有真实 pixelId 再加载
    ensureFbqStub()
    app.config.globalProperties.$pixel = {
      getUrlIDParams,
      getUrlFBParams,
      callTrack,
      callTrackHasPara,
      getFbId,
      setFbId,
      sendEventToAndroid,
      callAppsFlyer
    }
  }
}

export default FacebookPixelPlugin
