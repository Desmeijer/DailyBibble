// Step 7: Service Worker for Offline PWA Support (v3)
const CACHE_NAME = 'leaf-bible-v3';
const ASSETS_TO_CACHE = [
  './index.html',
  './style.css',
  './plan-part1.js',
  './plan-part2a.js',
  './plan-part2b.js',
  './context-data.js',
  './app-core.js',
  './app-reader.js',
  './manifest.json'
];

// Install: Cache all core application assets and activate immediately
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate: Clean up old cache buckets (like leaf-bible-v1 / v2) and claim clients
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Serve cached assets first, fall back to network, and dynamically cache passages
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, fetchResponse.clone());
          return fetchResponse;
        });
      }).catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
