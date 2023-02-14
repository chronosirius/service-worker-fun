/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" /> 
/**@type {ServiceWorkerGlobalScope} self */

async function stepFetch_fastest({ request, preload, fallback_cached }) {
    cache_response = await self.caches.match(request)
    if (cache_response) {
        return cache_response;
    }

    preload_res = await preload;
    if (preload_res) {
        return preload_res;
    }

    try {
        network_res = await fetch(request)
        cache = await self.caches.open('main_cache')
        cache.put(request, network_res.clone())
        return network_res;
    } catch (err) {
        fallback = await self.caches.match(fallback_cached)
        if (fallback) {
            return fallback;
        } else {
            return new Response('Network died!', {
                status: 408,
                headers: {"Content-Type": "text/plain"}
            })
        }
    }
}

self.addEventListener('install', ev => {
    ev.waitUntil(self.caches.open('main_cache').then(cache => {
        cache.addAll([
            '/',
            '/index.html',
            'page1.html',
            'page2.html',
            'e.jpg',
            'offline.html'
        ]).then(() => {console.log('cached')})
    }))
    ev.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', ev => {
    ev.waitUntil(self.clients.claim())
    ev.waitUntil(self.registration.navigationPreload.enable())
})

self.addEventListener('fetch', ev => {
    ev.respondWith(stepFetch_fastest({
        request: ev.request,
        preload: ev.preloadResponse,
        fallback_cached: "offline.html"
    }))
})