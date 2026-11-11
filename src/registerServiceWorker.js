/* eslint-disable no-console */

import { register } from 'register-service-worker'

// App 内嵌 WebView（127.0.0.1 本地静态服务）不要注册 SW，避免缓存旧包
const isAppWebView =
  typeof location !== 'undefined' &&
  /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(location.origin)

const shouldRegister = import.meta.env.PROD && !isAppWebView

if (shouldRegister) {
  register(`${import.meta.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated() {
      console.log('New content is available; please refresh.')
    },
    offline() {
      // 断网：展示离线品牌页（由 service-worker 缓存），页面上有 Retry
      if (typeof location !== 'undefined' && !/offline\.html$/.test(location.pathname)) {
        location.assign(`${import.meta.env.BASE_URL}offline.html`)
      }
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
