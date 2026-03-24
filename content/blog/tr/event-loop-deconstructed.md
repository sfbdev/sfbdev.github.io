---
title: "Event Loop'u Parçalıyoruz: Microtask'lar, Macrotask'lar ve Async Kodunuzun Neden Bozulduğu"
date: 2026-03-24
description: "JavaScript'in event loop öncelik sistemine derinlemesine bakış — microtask'lar, macrotask'lar ve gerçek dünya sonuçları."
---

JavaScript'in tek thread'li olduğunu biliyorsunuz. Event loop'u biliyorsunuz. Ama `Promise.resolve().then(fn)`'in neden `setTimeout(fn, 0)`'dan önce çalıştığını biliyor musunuz? Ve `queueMicrotask`, `MutationObserver`, `requestAnimationFrame` ve `setTimeout`'u karıştıran bir bloğun çalışma sırasını tam olarak tahmin edebilir misiniz?

Event loop tek bir kuyruk değildir — katı öncelik kurallarına sahip çoklu kuyruk sistemidir.

**Macrotask kuyruğu** (bazen task queue denir): `setTimeout`, `setInterval`, `setImmediate` (Node), I/O callback'leri, UI render olayları. Her event loop iterasyonunda bir macrotask işlenir.

**Microtask kuyruğu**: `Promise.then/catch/finally`, `queueMicrotask`, `MutationObserver`. Her macrotask tamamlandıktan ve call stack boşaldıktan sonra, sonraki macrotask çalışmadan önce **tüm** microtask kuyruğu boşaltılır — microtask işleme sırasında eklenen microtask'lar dahil.

Bunun gerçek sonuçları var:

```javascript
console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve()
  .then(() => {
    console.log('3')
    queueMicrotask(() => console.log('4'))
  })
  .then(() => console.log('5'))

queueMicrotask(() => console.log('6'))

console.log('7')
```

Çıktı: `1, 7, 3, 6, 5, 4, 2`

Senkron kod önce çalışır (1, 7). Sonra microtask kuyruğu boşalır: ilk `.then` tetiklenir (3), içindeki `queueMicrotask` (4)'ü kuyruğa ekler, bağımsız microtask tetiklenir (6), zincirli `.then` tetiklenir (5), sonra (4) — hepsi `setTimeout`'un macrotask'ı (2) sıra almadan önce.

## Pratikte Sizi Nerede Yakalar

**Sonsuz microtask döngüleri.** Bir microtask sürekli yeni microtask'lar eklerse, macrotask kuyruğu aç kalır. UI donar. Hiçbir repaint olmaz. `setTimeout` özyinelemesinin aksine, özyinelemeli microtask'lar tarayıcıya asla kontrol vermez.

**requestAnimationFrame zamanlaması.** rAF callback'leri tarayıcı boyamadan önce, microtask'lardan sonra, render pipeline'ının parçası olarak çalışır — macrotask olarak değil. `rAF` içinde `rAF` zincirlemek *sonraki* frame'e planlar, mevcut frame'e değil. Bunu bilmek animasyon sıralaması için kritiktir.

**Vue'nun nextTick'i.** Vue DOM güncellemelerini toplar ve asenkron olarak flush eder. `nextTick` eskiden microtask hack'i olarak `MutationObserver` kullanıyordu, sonra `Promise.then`'e geçti. Bunu anlamak, `nextTick`'in neden `setTimeout`'tan önce çalıştığını ve neden `nextTick` callback'inde güncellenmiş DOM'u güvenle okuyabildiğinizi açıklar.

## Node.js Karmaşıklık Ekler

Node'da `process.nextTick` (Promise microtask'larından önce tetiklenir — evet, `.then`'den *daha yüksek* önceliğe sahiptir), `setImmediate` (check aşamasında, I/O'dan sonra tetiklenir) ve libuv'un event loop aşamaları (timers → pending → idle → poll → check → close) vardır. Tarayıcı ve Node event loop'ları aynı değildir.

Event loop'a hakim olmak, asenkron zamanlama hakkında tahmin etmeyi bırakıp mantık yürütmeye başlamanız demektir.
