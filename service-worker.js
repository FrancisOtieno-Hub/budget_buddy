// Cache version - increment when you make changes
const CACHE_VERSION = 'v2';
const CACHE_NAME = `budget-buddy-${CACHE_VERSION}`;

// Files to cache for offline use
const STATIC_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon.png'
];

// Dynamic cache for runtime requests
const RUNTIME_CACHE = `budget-buddy-runtime-${CACHE_VERSION}`;

// Maximum age for cached items (7 days)
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000;

// Install event: cache app shell
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        console.log('[ServiceWorker] Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[ServiceWorker] Installation failed:', error);
      })
  );
});

// Activate event: cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old versions of our cache
            if (cacheName.startsWith('budget-buddy-') && cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Activation complete');
        return self.clients.claim(); // Take control of all pages
      })
  );
});

// Fetch event: Cache-first strategy with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached response if found and valid
        if (cachedResponse) {
          // Check if cache is still fresh for runtime cache
          const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date'));
          const now = new Date();
          
          if (cacheDate && (now - cacheDate) < MAX_CACHE_AGE) {
            console.log('[ServiceWorker] Serving from cache:', request.url);
            return cachedResponse;
          }
        }

        // Fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache if not a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
              return networkResponse;
            }

            // Clone the response
            const responseToCache = networkResponse.clone();

            // Add timestamp header and cache
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                const headers = new Headers(responseToCache.headers);
                headers.append('sw-cache-date', new Date().toISOString());
                
                const responseWithDate = new Response(responseToCache.body, {
                  status: responseToCache.status,
                  statusText: responseToCache.statusText,
                  headers: headers
                });

                cache.put(request, responseWithDate);
                console.log('[ServiceWorker] Cached new resource:', request.url);
              });

            return networkResponse;
          })
          .catch((error) => {
            console.log('[ServiceWorker] Fetch failed, serving from cache:', request.url);
            
            // Return cached response even if expired
            if (cachedResponse) {
              return cachedResponse;
            }

            // If requesting HTML and offline, return offline page
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }

            // Return error for other requests
            return new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Message event: handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    caches.open(RUNTIME_CACHE)
      .then((cache) => cache.addAll(urls))
      .then(() => {
        event.ports[0].postMessage({ success: true });
      })
      .catch((error) => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
  }
});

// Background sync (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

// Helper: Sync transactions (placeholder for future API integration)
async function syncTransactions() {
  console.log('[ServiceWorker] Syncing transactions');
  // Future implementation: sync with backend API
  return Promise.resolve();
}

// Periodic cache cleanup
async function cleanupOldCaches() {
  const caches = await caches.keys();
  const now = new Date();
  
  for (const cacheName of caches) {
    if (cacheName === RUNTIME_CACHE) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        const cacheDate = new Date(response.headers.get('sw-cache-date'));
        
        if (cacheDate && (now - cacheDate) > MAX_CACHE_AGE) {
          await cache.delete(request);
          console.log('[ServiceWorker] Removed expired cache:', request.url);
        }
      }
    }
  }
}

// Run cleanup periodically (every hour when SW is active)
setInterval(cleanupOldCaches, 60 * 60 * 1000);
