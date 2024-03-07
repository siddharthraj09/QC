const cacheName = "commodity-qc-v3";
const offlineUrl = "/offline.html";

const cacheAssetTypes = {
  scripts: ["/scripts/*.js"],
  styles: ["/styles/*.css"],
  images: ["/images/*"],
};

const dynamicRoutesToCache = ["/", "/api/reports"];

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAssets());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(handleFetchRequest(event.request));
});

async function cacheAssets() {
  const cache = await caches.open(cacheName);
  await cache.addAll([
    offlineUrl,
    ...Object.values(Object.values(cacheAssetTypes)).flat(),
    ...dynamicRoutesToCache,
  ]);
}

async function handleFetchRequest(request) {
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    // Cache standard assets types
    if (isMatchingAssetType(url.pathname, cacheAssetTypes)) {
      return cacheFirst(request);
    }

    // Dynamic route caching
    if (dynamicRoutesToCache.includes(url.pathname)) {
      return networkFirstWithCacheUpdate(request);
    }
  }

  // Network fallback for everything else
  return fetch(request).catch(() => caches.match(offlineUrl));
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
    console.error("Network fetch failed:", error);
    return caches.match(request);
  }
}

function isMatchingAssetType(urlPathname, assetTypes) {
  return Object.keys(assetTypes).some((type) =>
    assetTypes[type].some((pattern) => urlPathname.match(pattern))
  );
}
