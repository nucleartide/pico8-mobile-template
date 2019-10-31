// For a good tutorial, see: https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp

/**
 * Configuration.
 */

// FilesToCache is a list of JavaScript files (served from your origin) that
// will be cached on the user's device.
const FilesToCache = [
  // ...
];

// CacheName is the identifier for your cache.
// You should update this manually whenever any of the files in `FilesToCache`
// change.
const CacheName = "pico8-game-cache-v1";

/**
 * Service Worker event handlers.
 */

// On install, cache all JavaScripts.
self.addEventListener("install", event => {
  console.log("Caching your JavaScripts...");
  event.waitUntil(cacheJavaScripts());

  // Ensure new versions of a Service Worker are activated immediately.
  // See: https://bitsofco.de/what-self-skipwaiting-does-to-the-service-worker-lifecycle/
  self.skipWaiting();
});

// On activation, delete stale caches.
self.addEventListener("activate", event => {
  console.log("Deleting stale caches...");
  event.waitUntil(deleteStaleCaches());

  // Allow this Service Worker to take control of all pages immediately.
  self.clients.claim();
});

// Customize fetch() behavior.
self.addEventListener("fetch", event => {
  console.log("Fetching", event.request.url);
  event.respondWith(handleFetch(event.request));
});

/**
 * Utils.
 */

async function cacheJavaScripts() {
  const cache = await caches.open(CacheName);
  return cache.addAll(FilesToCache);
}

async function deleteStaleCaches() {
  const keyList = await caches.keys();
  return keyList.map(cacheKey =>
    cacheKey !== CacheName ? caches.delete(cacheKey) : null
  );
}

// handleFetch fetches files from the browser's cache first.
// If a file isn't found, handleFetch will request the file from the network.
// If the network request fails, handleFetch will throw an error.
async function handleFetch(req) {
  try {
    const cache = await caches.open(CacheName);
    return cache.match(req.url);
  } catch (err) {
    console.error("Failed to fetch from cache, trying network:", err);
    const res = await fetch(req);
    return res;
  }
}
