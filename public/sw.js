/* eslint-disable */
const cacheName = 'dndbattletracker-v1';

const contentToCache = [
  '/',
  '/favicon.png',
  'https://cdn.ko-fi.com/cdn/kofi4.png?v=3',
  'https://fonts.googleapis.com/css2?family=IM+Fell+Great+Primer+SC&family=Open+Sans&display=swap'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(contentToCache);
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      return caches.delete(key);
    }));
  }));
});

self.addEventListener('fetch', function (event) {
  const requestURL = new URL(event.request.url);

  if (requestURL.origin == location.origin) {
    event.respondWith(
      caches.open(cacheName).then(function (cache) {
        return fetch(event.request.url).then((fetchedResponse) => {
          cache.put(event.request, fetchedResponse.clone());
          return fetchedResponse;
        }).catch(() => {
          return cache.match(event.request.url);
        });
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
