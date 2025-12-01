// Dummy service worker to prevent 404 errors in dev
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  self.clients.claim()
})
