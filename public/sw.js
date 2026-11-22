// Prosty service worker: cache-first dla zasobów, network-first dla nawigacji. Zero zależności.
const CACHE = "akta-lessu-v9";
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return; // serwer gry, pogoda, Wisła: zawsze z sieci, nigdy z pamięci podręcznej (statystyki stawały w miejscu)
  if (req.mode === "navigate") {
    // GitHub Pages każe przeglądarce trzymać HTML 10 minut; „no-cache" wymusza sprawdzenie u serwera, cache tylko bez sieci.
    e.respondWith(fetch(req, { cache: "no-cache" }).then((r) => { const c = r.clone(); caches.open(CACHE).then((cache) => cache.put(req, c)); return r; }).catch(() => caches.match(req)));
    return;
  }
  // Rzeczy, które mają być świeże mimo pamięci podręcznej: znacznik wersji i katalog „na żywo" (klucze spraw, rejestr dnia premiery). Sieć najpierw, cache tylko bez sieci.
  if (/\/version\.json|\/live\//.test(req.url)) {
    e.respondWith(fetch(req, { cache: "no-store" }).then((r) => { const c = r.clone(); caches.open(CACHE).then((cache) => cache.put(req, c)); return r; }).catch(() => caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { const c = r.clone(); caches.open(CACHE).then((cache) => cache.put(req, c)); return r; })));
});
