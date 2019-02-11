console.log('this is the Service Worker');

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '2' },
    { url: '/index.html', revision: '2' },
  ]);

  workbox.routing.registerRoute(
    new RegExp('.*\.js'),
    workbox.strategies.networkFirst()
  );

  workbox.routing.registerRoute(
    // Cache CSS files
    /.*\.css/,
    // Use cache but update in the background ASAP
    workbox.strategies.staleWhileRevalidate({
      // Use a custom cache name
      cacheName: 'css-cache',
    })
  );

  workbox.routing.registerRoute(
    new RegExp('^https://api.openweather.org/data/2.5/weather'),
    workbox.strategies.cacheFirst({
      cacheName: 'weatherApi',
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 10 * 60
        }),
        new workbox.cacheable.Plugin({
          statuses: [0, 200]
        }),
      ],
    })
  )
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}