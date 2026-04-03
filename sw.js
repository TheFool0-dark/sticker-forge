const CACHE_NAME = "sticker-orbit-cache-v10";
const APP_SHELL = [
  "./",
  "./index.html",
  "./explore.html",
  "./studio.html",
  "./agent.html",
  "./login.html",
  "./styles.css",
  "./login.css",
  "./script.js",
  "./auth.js",
  "./agent.js",
  "./supabase-config.js",
  "./openai-config.js",
  "./manifest.json",
  "./favicon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(event.request));
    return;
  }

  event.respondWith(handleAssetRequest(event.request));
});

async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match("./index.html");
  }
}

async function handleAssetRequest(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}
