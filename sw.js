// 画面（index.html）を端末に残し、電波の無い牛舎でもアプリが開けるようにする。
// 電波があるときは毎回サーバーの新しいものを使い（更新がすぐ届く）、取れないときだけ残しておいた分を出す。
// GitHub Pages は「10分は前のものを使ってよい」（max-age=600）で配るので、ブラウザの控えを使わず必ずサーバーに聞く（cache: "no-store"）。
// 2026-11-10：これが無かったため、上げ直してもスマホに古い画面が残った。
// 牛の情報や一覧は index.html の側で IndexedDB に覚えている。記録の送信は index.html の預かり（et_xlq）が受け持つ。
const CACHE = "et-app-v2";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return; // サインインや OneDrive の通信には触らない
  e.respondWith(
    fetch(req, { cache: "no-store" }).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
