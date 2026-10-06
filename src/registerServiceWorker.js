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
      console.log(
        'No internet connection found. App is running in offline mode.'
      )
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
