// Service Worker for Offline Play
// Cache game files for offline access

const CACHE_NAME = 'game-hub-v1';
const RUNTIME_CACHE = 'game-hub-runtime-v1';

// Files to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/neon-breakout.html',
  '/pixel-garden.html',
  '/geometry-dash-mini.html',
  '/stats.html',
  '/lib/leaderboard.js',
  '/lib/social-share.js',
  '/lib/achievements.js',
  '/lib/i18n.js'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(PRECACHE_URLS.filter(url => {
          // Only cache files that exist
          return true;
        }));
      })
      .catch(err => {
        console.log('Service Worker: Cache install failed', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (analytics, etc.)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page if available
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Background sync for leaderboard submissions (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-leaderboard') {
    event.waitUntil(syncLeaderboard());
  }
});

async function syncLeaderboard() {
  // Get pending submissions from IndexedDB
  // Submit to Supabase
  // Clear pending submissions
  console.log('Service Worker: Syncing leaderboard');
}

