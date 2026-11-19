/* Service worker: deixa o app funcionar offline.
   Estratégia: com internet, sempre busca a versão mais nova (rede primeiro);
   sem internet, usa a cópia guardada. Ao publicar uma atualização, aumente a versão abaixo. */
const CACHE = 'nettrail-v5';
const FILES = ['./', 'index.html', 'css/style.css', 'js/content.js', 'js/app.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  // cache: 'reload' ignora o cache HTTP do navegador, garantindo arquivos novos
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.all(FILES.map(f => fetch(new Request(f, { cache: 'reload' })).then(r => r.ok && c.put(f, r)).catch(() => { }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const sameOrigin = new URL(req.url).origin === self.location.origin;
  if (!sameOrigin) { // fontes do Google: cache primeiro
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res; })));
    return;
  }
  // arquivos do app: rede primeiro (sem cache HTTP), cópia guardada se estiver offline
  e.respondWith(
    fetch(req, { cache: 'no-cache' }).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html')))
  );
});
