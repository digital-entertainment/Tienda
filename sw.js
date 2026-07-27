const CACHE_NAME = 'innovanet-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './estilo1.css',
  './new-login-style.css',
  './assets/icon-512x512.png',
  './manifest.json'
];

// Instalar el service worker y guardar en caché los recursos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// ESTRATEGIA: "Network First" (Red primero, caché como respaldo)
// Esto garantiza que SIEMPRE se cargue la versión más reciente si hay internet,
// evitando por completo el problema de que los usuarios se queden con caché vieja.
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 1. Siempre intenta ir a internet primero a buscar lo más nuevo
        return response;
      })
      .catch(() => {
        // 2. Solo si el usuario NO tiene internet, intenta buscar en la caché
        return caches.match(event.request);
      })
  );
});

// Activar el service worker y limpiar cachés antiguas
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
