const cacheName = "commodity-qc-v3";
const offlineUrl = "/offline.html"; // You'll need to create this file

// File types for automatic caching
const cacheAssetTypes = {
  scripts: ["/scripts/*.js"],
  styles: ["/styles/*.css"],
  images: ["/images/*"],
};

// Dynamic routes to cache (adjust as needed)
const dynamicRoutesToCache = [
  "/",
  "/api/reports", // Example route if you will display past reports offline
];

// Cache assets on install
self.addEventListener("install", async (event) => {
  event.waitUntil(createCacheAndAddAssets());
});

// Cache fetch handling
self.addEventListener("fetch", async (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Cache standard asset types
  if (url.origin === self.location.origin) {
    const cacheKeys = Object.keys(cacheAssetTypes).filter((type) =>
      cacheAssetTypes[type].some((pattern) => url.pathname.match(pattern))
    );
    if (cacheKeys.length > 0) {
      event.respondWith(cacheFirst(request));
      return;
    }
  }

  // Dynamic route caching
  if (dynamicRoutesToCache.includes(url.pathname)) {
    event.respondWith(networkFirstWithCacheUpdate(request));
    return;
  }

  // Network fallback for everything else
  event.respondWith(fetch(request));
});

// Helper functions
async function createCacheAndAddAssets() {
  const cache = await caches.open(cacheName);

  // Cache resources needed for offline functionality
  await cache.addAll([
    offlineUrl,
    ...Object.values(Object.values(cacheAssetTypes)).flat(),
    // Cache the root HTML and dynamic routes
    ...dynamicRoutesToCache,
  ]);
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached || fetch(request);
}

async function networkFirstWithCacheUpdate(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return caches.match(request);
  }
}
