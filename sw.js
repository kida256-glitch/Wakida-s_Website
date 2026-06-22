// Service Worker for Performance Optimization & Offline Support
const CACHE_NAME = 'website-cache-v6';
const IMAGE_CACHE_NAME = 'website-images-v2';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './about.html',
    './roles.html',
    './skills.html',
    './projects.html',
    './impact.html',
    './gallery.html',
    './styles.css',
    './script.js',
    './animated-background.js',
    './gallery.js',
    './photos.json',
    './assets/icons/social/github.svg',
    './assets/icons/social/linkedin.svg',
    './assets/icons/social/x.svg',
    './assets/icons/social/instagram.svg',
    './assets/icons/social/tiktok.svg',
    './assets/icons/social/bluesky.svg',
    './assets/icons/roles/kahoot.svg',
    './assets/icons/roles/aws.svg',
    './assets/icons/roles/uipath.svg',
    './assets/icons/roles/ethereum.svg',
    './assets/icons/roles/community.svg',
    './assets/icons/roles/mubs.svg',
    './assets/icons/projects/ethereum.svg',
    './assets/icons/projects/airqo.svg',
    './assets/icons/projects/unlock.svg',
    './assets/icons/projects/blockchain.svg',
    './assets/icons/projects/tensorflow.svg',
    './assets/icons/projects/django.svg'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
                console.log('Some assets failed to cache', err);
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    const isSameOrigin = url.origin === self.location.origin;
    const isImage = event.request.destination === 'image' ||
        url.pathname.includes('/kida101/') ||
        /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(url.pathname);

    if (isSameOrigin && isImage) {
        event.respondWith(
            caches.open(IMAGE_CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cached) => {
                    const networkFetch = fetch(event.request).then((response) => {
                        if (response && response.status === 200) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    }).catch(() => cached);

                    return cached || networkFetch;
                });
            })
        );
        return;
    }

    if (!isSameOrigin) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            const networkFetch = fetch(event.request).then((response) => {
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            }).catch(() => cached);

            return cached || networkFetch;
        })
    );
});
