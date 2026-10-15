// 画面（index.html）を端末に残し、電波の無い牛舎でもアプリが開けるようにする。
// 電波があるときは毎回サーバーの新しいものを使い（更新がすぐ届く）、取れないときだけ残しておいた分を出す。
// 牛の情報や一覧は index.html の側で IndexedDB に覚えている。記録の送信は index.html の預かり（et_xlq）が受け持つ。
const CACHE = "et-app-v1";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return; // サインインや OneDrive の通信には触らない
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
