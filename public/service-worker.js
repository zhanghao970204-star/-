/* Minimal service worker for PWA installability + offline page.
   Upgrade Node to >=20 and re-enable vite-plugin-pwa for full Workbox caching. */
const OFFLINE_CACHE = 'luckyplay-offline-v1'
const OFFLINE_URL = '/offline.html'
const OFFLINE_ASSETS = [OFFLINE_URL, '/img/icons/android-chrome-192x192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(OFFLINE_CACHE)
      .then((cache) => cache.addAll(OFFLINE_ASSETS))
      .catch(() => {})
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('luckyplay-offline-') && k !== OFFLINE_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  )
})

// 只兜底页面导航：断网时打开离线页，其它请求不缓存
self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.mode !== 'navigate') return
  event.respondWith(
    fetch(req).catch(() =>
      caches.match(OFFLINE_URL).then((res) => res || Response.error())
    )
  )
})
