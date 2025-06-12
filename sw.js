    const CACHE_NAME = 'wingman-cache-v3';
    const urlsToCache = [
        '/',
        '/index.html',
        'https://cdn.tailwindcss.com',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
        'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
        'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
        'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js',
        'https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js'
    ];

    self.addEventListener('install', event => {
        event.waitUntil(
            caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and caching essential assets');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Failed to cache files during install:', err);
            })
        );
        self.skipWaiting();
    });

    self.addEventListener('fetch', event => {
        if (event.request.method !== 'GET') {
            return;
        }

        event.respondWith(
            caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request).catch(() => {
                    console.log('Fetch failed for:', event.request.url);
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
