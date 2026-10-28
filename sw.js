// Service Worker for Offline PWA Support (v10 - Network-First for Instant Updates)
const CACHE_NAME = 'leaf-bible-v10';
const ASSETS_TO_CACHE = [
  './index.html',
  './style.css',
  './plan-part1.js',
  './plan-part2a.js',
  './plan-part2b.js',
  './context-data.js',
  './app-core.js',
  './app-reader.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.jpg',
  './icon.jpg'
];

// Install: Cache core application assets and activate immediately
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate: Purge old cache versions and claim active clients
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

// Fetch: Network-First for app assets (fresh updates), Cache-First fallback (offline support)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // For bolls.life scripture API requests: Cache-first to preserve quota & speed
  if (url.hostname.includes('bolls.life')) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        return cachedResponse || fetch(e.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // For app assets (HTML, JS, CSS, Icons): Network-first so edits appear immediately
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (e.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// === END OF sw.js ===
