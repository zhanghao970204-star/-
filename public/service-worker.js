/* Minimal service worker placeholder for PWA installability.
   Upgrade Node to >=20 and re-enable vite-plugin-pwa for full Workbox caching. */
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
