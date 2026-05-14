// Service Worker for Performance Optimization & Offline Support
const CACHE_NAME = 'website-cache-v2';
const IMAGE_CACHE_NAME = 'website-images-v1';

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/about.html',
    '/roles.html',
    '/skills.html',
    '/projects.html',
    '/impact.html',
    '/gallery.html',
    '/styles.css',
    '/script.js',
    '/animated-background.js',
    '/x-logo.webp',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then((cache) => {
                console.log('Caching assets');
                return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                    console.log('Some assets failed to cache', err);
                    return Promise.resolve();
                });
            }),
            caches.open(IMAGE_CACHE_NAME)
        ])
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }
    
    const url = new URL(event.request.url);
    
    // Image caching strategy - cache first
    if (event.request.destination === 'image' || url.pathname.includes('/Benji_s') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.png') || url.pathname.endsWith('.webp')) {
        event.respondWith(
            caches.open(IMAGE_CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((response) => {
                    return response || fetch(event.request).then((response) => {
                        if (response && response.status === 200) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    }).catch(() => {
                        return new Response('Image not available');
                    });
                });
            })
        );
        return;
    }
    
    // For other assets, use network first, fall back to cache
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    return cachedResponse || new Response('Offline - Content not available');
                });
            })
    );
});
