/**
 * Gym Evolution - PWA Service Worker (Offline Cache & Resilience)
 */

const CACHE_NAME = 'gym-evolution-cache-v1.7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/domain/models.js',
  './js/domain/bmr.js',
  './js/domain/units.js',
  './js/domain/foodDb.js',
  './js/domain/exerciseDb.js',
  './js/domain/aiAssistant.js',
  './js/domain/exporter.js',
  './js/domain/reminderManager.js',
  './js/data/dbSchema.js',
  './js/data/localRepository.js',
  './js/ui/notifier.js',
  './js/ui/confirmModal.js',
  './js/ui/remindersModal.js',
  './js/ui/dashboard.js',
  './js/ui/nutrition.js',
  './js/ui/workout.js',
  './js/ui/evolution.js',
  './js/ui/assistant.js',
  './js/app.js'
];

// Install Event: Pre-cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline application shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clear outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing legacy cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache First with Network Fallback
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // Don't intercept Google API or external analytics requests directly
  const url = new URL(event.request.url);
  if (url.origin.includes('accounts.google.com') || url.origin.includes('googleusercontent.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version immediately, fetch updated copy in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // If offline and request is for navigation, return index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
