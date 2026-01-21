const CACHE_NAME = 'osint-terminal-v1.2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html'
];

// URLs que devem sempre tentar a rede primeiro para garantir dados atualizados
const NETWORK_FIRST_URLS = [
  '/',
  '/index.html',
  'App.tsx',
  'constants.ts'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Worker] Purgando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Estratégia Network-First para o documento principal e scripts internos
  if (NETWORK_FIRST_URLS.includes(url.pathname) || url.pathname.endsWith('.ts') || url.pathname.endsWith('.tsx')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Estratégia Stale-While-Revalidate para bibliotecas externas (esm.sh, fonts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
        }
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});