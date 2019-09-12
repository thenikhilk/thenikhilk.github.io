self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('thenikhilk').then(function (cache) {
            return cache.addAll([
                '/index.html',
                '/favicon.ico',
                '/assets/css/main.css',
                '/assets/css/font-awesome.min.css',
                '/assets/css/images/bg.jpg',
            ]);
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});