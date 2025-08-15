const CACHE_NAME = 'open-dash-v1';
const ASSETS = ['.', 'index.html', 'manifest.json'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if(ASSETS.includes(url.pathname.replace(/^\//,''))){
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
  }else{
    e.respondWith(fetch(e.request).catch(()=> caches.match('index.html')));
  }
});
