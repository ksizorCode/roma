/**
 * 🏛️ Roma Explorer - Service Worker
 * Gestiona el caché para funcionamiento offline
 */

// 📦 Nombre y versión del caché
const CACHE_NAME = 'roma-explorer-v1.0.0';

// 🗂️ Recursos estáticos a cachear en la instalación
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/mapa.js',
  './js/clima.js',
  './lista.json',
  './manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

// ⚙️ Evento de instalación - cachea los recursos estáticos
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Service Worker: Cacheando recursos estáticos');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('⚠️ Error cacheando algunos recursos:', err);
      });
    })
  );
  // Activa inmediatamente sin esperar
  self.skipWaiting();
});

// 🔄 Evento de activación - limpia cachés antiguos
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log(`🗑️ Eliminando caché antiguo: ${name}`);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// 🌐 Evento fetch - estrategia Network First con fallback a caché
self.addEventListener('fetch', (event) => {
  // Ignorar solicitudes no GET
  if (event.request.method !== 'GET') return;

  // Estrategia especial para APIs de clima (solo red)
  if (event.request.url.includes('open-meteo.com')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Sin conexión a internet' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Estrategia para imágenes de picsum (caché primero)
  if (event.request.url.includes('picsum.photos')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Estrategia general: Network First con fallback a caché
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Actualiza el caché con la respuesta fresca
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, usa el caché
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Fallback para páginas HTML
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
