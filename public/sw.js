/* eslint-disable no-restricted-globals */
const cacheName = 'dndbattletracker';

const contentToCache = [
  '/',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(contentToCache);
  })());
});

self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    if (r) return r;
    return fetch(e.request);
  })());
});
