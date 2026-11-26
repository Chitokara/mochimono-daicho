var V="mochimono-v1";
var FILES=["./","./index.html"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(hit){
    var net=fetch(e.request).then(function(res){
      if(res&&res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(e.request,cp)})}
      return res;
    }).catch(function(){return hit});
    return hit||net;
  }));
});
