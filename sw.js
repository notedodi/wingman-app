    const CACHE_NAME = 'wingman-cache-v4'; 
    const urlsToCache = [
        '/',
        '/index.html',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png'
    ];

    self.addEventListener('install', event => {
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
                console.log('Opened cache and caching essential assets');
                return cache.addAll(urlsToCache);
            })
        );
        self.skipWaiting();
    });

    self.addEventListener('fetch', event => {
        if (event.request.mode === 'navigate') {
            event.respondWith(
                caches.match(event.request).then(response => {
                    return response || fetch(event.request);
                })
            );
            return;
        }

        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return fetch(event.request).then(networkResponse => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }).catch(() => {
                    return cache.match(event.request);
                });
            })
        );
    });

    self.addEventListener('activate', event => {
      const cacheWhitelist = [CACHE_NAME];
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                console.log('Deleting old cache:', cacheName);
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });
