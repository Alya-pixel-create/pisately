const CACHE_NAME = 'literature-cache-v1';
const OFFLINE_PAGE = '/offline.html';

// Файлы для кэширования (основываясь на вашем списке)
const ASSETS_TO_CACHE = [
  // HTML-файлы
  '/index.html',
  '/biographies.html',
  '/works.html',
  
  // CSS и JS
  '/css/styles.css',
  '/js/app.js',
  
  // Иконки
  '/icons/icon-512.png',
  
  // Манифест
  '/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Активация и очистка старого кэша
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Стратегия кэширования: Network First
self.addEventListener('fetch', event => {
  // Для HTML-страниц: сначала сеть, потом кэш
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Для остальных ресурсов: сначала кэш, потом сеть
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
      .catch(() => {
        if (event.request.headers.get('accept').includes('image')) {
          return caches.match('/images/placeholder.jpg');
        }
      })
  );
});

// Обработка оффлайн-режима
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_PAGE))
    );
  }
});