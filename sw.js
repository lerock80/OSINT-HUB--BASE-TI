const CACHE_NAME = 'osint-terminal-v1.1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Worker] Caching de ativos operacionais finalizado');
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
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Estratégia Cache-First para fontes e scripts externos
      if (response) return response;
      
      return fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          // Não cacheamos links externos de ferramentas (URLs de terceiros)
          if (event.request.url.includes('esm.sh') || event.request.url.includes('fonts.gstatic.com')) {
            cache.put(event.request.url, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    })
  );
});