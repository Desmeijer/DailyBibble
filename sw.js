// Step 7: Service Worker for Offline PWA Support
const CACHE_NAME = 'leaf-bible-v1';
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

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).then((fetchResponse) => {
        // Cache API responses dynamically
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, fetchResponse.clone());
          return fetchResponse;
        });
      }).catch(() => {
        // Fallback if offline and asset not cached
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
