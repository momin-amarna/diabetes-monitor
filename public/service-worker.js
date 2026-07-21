const CACHE_NAME = 'smartdiabetes-v1';
const URLS_TO_CACHE = [
  '/',
  '/app',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline page or cached response if available
          return caches.match('/offline.html');
        });
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-measurements') {
    event.waitUntil(syncMeasurements());
  }
  if (event.tag === 'sync-weights') {
    event.waitUntil(syncWeights());
  }
});

async function syncMeasurements() {
  try {
    const response = await fetch('/api/sheets/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'measurements' }),
    });
    return response.ok;
  } catch (error) {
    console.error('Sync failed:', error);
    return false;
  }
}

async function syncWeights() {
  try {
    const response = await fetch('/api/sheets/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'weights' }),
    });
    return response.ok;
  } catch (error) {
    console.error('Sync failed:', error);
    return false;
  }
}
