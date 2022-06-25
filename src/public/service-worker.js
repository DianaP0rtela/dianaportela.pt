const VERSION = 'dianaportela-0.0.1';

const fetchAndCache = async request => {
  const result = await fetch(request);
  caches.open(VERSION).then(cache => cache.put(request.url, result));
  return result.clone();
};

self.onfetch = e => {
  if (e.request.url.match(/\/data|\/pdf|google-analytics.com|googletagmanager.com|chrome-extension/)) return;

  e.respondWith(navigator.onLine && (e.request.destination === 'document' || !e.request.url.match(/https?:\/\/dianaportela.pt/))
    ? fetchAndCache(e.request)
    : caches.open(VERSION).then(cache => cache
      .match(e.request.url, { ignoreSearch: false })
      .then(response => response || fetchAndCache(e.request))));
};
