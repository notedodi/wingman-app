    const CACHE_NAME = 'wingman-cache-v3';
    // Add all necessary assets for offline functionality
    const urlsToCache = [
        '/',
        '/index.html',
        // Add other assets like CSS, main JS file if you split it
        'https://cdn.tailwindcss.com',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
        // Caching Firebase SDKs is crucial for offline functionality
        'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
        'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
        'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js',
        'https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js'
    ];

    self.addEventListener('install', event => {
        event.waitUntil(
            caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and caching files');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Failed to cache files during install:', err);
            })
        );
        self.skipWaiting();
    });

    self.addEventListener('fetch', event => {
        event.respondWith(
            caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    // This is a basic offline fallback, you can expand this
                    console.log('Fetch failed; returning offline page (if available) or error.');
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
