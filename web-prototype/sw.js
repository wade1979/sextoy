// Service Worker for PWA functionality
const CACHE_NAME = 'smart-control-v1.1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/mqtt.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://unpkg.com/mqtt@5.3.4/dist/mqtt.min.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      });
    })
  );
});

// Fetch event - serve cached content when offline
// Strategy: Network first, fallback to cache (better for development)
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response for caching
        const responseToCache = response.clone();
        
        // Update cache in background
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((response) => {
          // Return cached version or fallback to index.html for navigation
          if (response) {
            return response;
          }
          
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Background sync for MQTT messages
self.addEventListener('sync', (event) => {
  if (event.tag === 'mqtt-sync') {
    console.log('Background sync triggered');
    event.waitUntil(
      // Handle offline MQTT messages
      handleOfflineMessages()
    );
  }
});

// Handle offline MQTT messages
async function handleOfflineMessages() {
  try {
    // Get offline messages from IndexedDB
    const messages = await getOfflineMessages();
    
    // Send messages when back online
    for (const message of messages) {
      await sendMQTTMessage(message);
    }
    
    // Clear offline messages
    await clearOfflineMessages();
    
  } catch (error) {
    console.error('Failed to sync offline messages:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Smart Control', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for offline message handling
async function getOfflineMessages() {
  // Implementation would use IndexedDB
  return [];
}

async function sendMQTTMessage(message) {
  // Implementation would send MQTT message
  console.log('Sending offline message:', message);
}

async function clearOfflineMessages() {
  // Implementation would clear IndexedDB
  console.log('Clearing offline messages');
}

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'device-heartbeat') {
    event.waitUntil(
      sendHeartbeat()
    );
  }
});

async function sendHeartbeat() {
  try {
    // Send heartbeat to device
    console.log('Sending periodic heartbeat');
  } catch (error) {
    console.error('Failed to send heartbeat:', error);
  }
}
