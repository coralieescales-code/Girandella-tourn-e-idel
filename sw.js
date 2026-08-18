/* Service worker : rend l'app disponible HORS LIGNE.
   Tout est mis en cache à la première visite ; ensuite l'app se charge
   sans aucun réseau. */
const CACHE = "ma-tournee-v1";
const FILES = ["./", "./index.html", "./manifest.json", "./icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (cached) =>
        cached ||
        fetch(e.request).catch(() => caches.match("./index.html"))
    )
  );
});
