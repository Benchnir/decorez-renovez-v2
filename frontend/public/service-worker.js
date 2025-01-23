const CACHE_NAME = 'decorez-v1';

// Add all static assets that should be cached
const urlsToCache = [
  '/',
  '/offline',
  '/static/icons/icon-192x192.png',
  '/static/icons/icon-512x512.png',
  '/static/images/offline.svg'
];

// Install service worker and cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Network first, falling back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response as it can only be consumed once
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            // Add the response to cache for future offline use
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // If network request fails, try to get it from cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            // If the resource is not in cache, return the offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline');
            }

            // For other requests, return a default offline asset
            return caches.match('/static/images/offline.svg');
          });
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reviews') {
    event.waitUntil(syncReviews());
  } else if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/static/icons/icon-192x192.png',
    badge: '/static/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir plus',
        icon: '/static/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/static/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Décorez-Rénovez', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app and navigate to the relevant page
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sync reviews when back online
async function syncReviews() {
  const reviews = await getReviewsFromIndexedDB();
  
  for (const review of reviews) {
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
      });
      
      // Remove from IndexedDB after successful sync
      await removeReviewFromIndexedDB(review.id);
    } catch (error) {
      console.error('Error syncing review:', error);
    }
  }
}

// Sync messages when back online
async function syncMessages() {
  const messages = await getMessagesFromIndexedDB();
  
  for (const message of messages) {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });
      
      // Remove from IndexedDB after successful sync
      await removeMessageFromIndexedDB(message.id);
    } catch (error) {
      console.error('Error syncing message:', error);
    }
  }
}
