/* CLASSY_CS offline shell cache.
 * Registered only in production builds; the app works fully client-side
 * after the first load, so this just makes reloads work without a network. */
const CACHE_NAME = "classycs-v1";
const SHELL = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Cache-first for same-origin assets, network fallback for the rest.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          if (
            response.ok &&
            event.request.url.startsWith(self.location.origin)
          ) {
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(event.request, copy),
            );
          }
          return response;
        })
        .catch(() =>
          // SPA navigations fall back to the cached shell.
          caches.match("/index.html"),
        );
    }),
  );
});
