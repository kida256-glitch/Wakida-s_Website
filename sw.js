// Service Worker for Performance Optimization & Offline Support
const CACHE_NAME = 'website-cache-v1';
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
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets');
            return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.log('Some assets failed to cache', err);
                // Continue even if some assets fail
                return Promise.resolve();
            });
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Handle requests
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached response if available
            if (response) {
                return response;
            }
            
            // Otherwise fetch from network
            return fetch(event.request)
                .then((response) => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    // Cache successful responses
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    
                    return response;
                })
                .catch(() => {
                    // Return cached response or offline page
                    return caches.match(event.request).then((cachedResponse) => {
                        return cachedResponse || new Response('Offline - Content not available');
                    });
                });
        })
    );
});
