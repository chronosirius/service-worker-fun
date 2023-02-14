/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" /> 
/**@type {ServiceWorkerGlobalScope} self */

async function stepFetch_fastest({ req, preload}) {

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
    ev.waitUntil(self.Clients.claim())
    ev.waitUntil(self.registration.navigationPreload.enable())
})

self.addEventListener('fetch', ev => {
    ev.respondWith(stepFetch_fastest({

    }))
})