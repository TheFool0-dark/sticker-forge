const CACHE_NAME = "sticker-orbit-cache-v8";
const ASSETS = [
  "./",
  "./index.html",
  "./explore.html",
  "./studio.html",
  "./agent.html",
  "./styles.css",
  "./script.js",
  "./auth.js",
  "./agent.js",
  "./supabase-config.js",
  "./openai-config.js",
  "./manifest.json",
  "./favicon.svg",
  "./login.html",
  "./login.css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
