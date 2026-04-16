self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('yap-static-v1').then((cache) =>
      cache.addAll(['/']),
    ),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return

  if (request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone()
            caches.open('yap-static-v1').then((cache) => {
              cache.put(request, copy)
            })
            return response
          }),
      ),
    )
  }
})

