---
title: "JavaScript Proxy ve Metaprogramlama: Sıfırdan Reaktif Sistem İnşa Etmek"
date: 2026-03-23
description: "Proxy, Vue 3'ün reaktivitesini nasıl güçlendiriyor — ve kendiniz neler inşa edebilirsiniz."
---

Çoğu frontend developer reaktiviteyi her gün Vue, Solid veya MobX üzerinden kullanıyor — ama çok azı bunun arka planda nasıl çalıştığını anlıyor. Modern JavaScript'te cevap neredeyse her zaman `Proxy`.

`Proxy` bir nesneyi sarar ve temel operasyonları — property erişimi, atama, silme, numaralandırma, fonksiyon çağrısı — trap'ler içeren bir handler nesnesi aracılığıyla yakalar. Bu metaprogramlamadır: çalışma zamanında diğer kodun davranışı üzerinde çalışan kod.

```javascript
const handler = {
  get(target, prop, receiver) {
    track(target, prop)
    const value = Reflect.get(target, prop, receiver)
    return typeof value === 'object' && value !== null
      ? new Proxy(value, handler)
      : value
  },
  set(target, prop, value, receiver) {
    const oldValue = target[prop]
    const result = Reflect.set(target, prop, value, receiver)
    if (oldValue !== value) trigger(target, prop)
    return result
  }
}
```

Bu, Vue 3'ün `reactive()`'inin dahili olarak yaptığının basitleştirilmiş versiyonudur. `get` trap'i bir hesaplama sırasında hangi property'lere erişildiğini izler (dependency tracking), `set` trap'i ise değerler değiştiğinde bağımlı effect'lerin yeniden çalışmasını tetikler. `get`'teki özyinelemeli proxy'leme — iç içe nesneleri tembel olarak sarma — derin reaktivitenin tüm nesne ağacını önceden taramadan nasıl çalıştığıdır.

## Neden Object.defineProperty Yerine Proxy?

Vue 2, `defineProperty` kullanıyordu ve bu, başlangıç zamanında property isimlerini bilmeyi gerektiriyordu. Bu, Vue 2'nin property ekleme veya silmelerini algılayamayacağı ve array index mutasyonlarını doğal olarak gözlemleyemeyeceği anlamına geliyordu. `Proxy`, bireysel property'ler yerine nesnenin kendisi üzerindeki operasyonları yakalar ve tüm bu sınırlamaları çözer.

## Reflect Bağlantısı

Doğrudan property erişimi yerine `Reflect.get` ve `Reflect.set` kullanıldığını fark edeceksiniz. `Reflect` metotları `Proxy` trap'lerini bire bir yansıtır ve `receiver`'ı doğru şekilde yönetir — bu, proxy'lenmiş nesneler prototip olarak kullanıldığında önemlidir. `Reflect`'i atlayıp doğrudan `target[prop]` kullanmak, prototip zinciri delegasyonunu bozar ve miras alınan reaktif nesnelerde ince hatalara neden olur.

## Framework'ler Dışında Pratik Uygulamalar

**Validasyon katmanları** — tüketen kodu değiştirmeden çalışma zamanında şemaları uygulamak için `set`'i yakalayın.

**Lazy loading** — ilk erişimde veri çekmek ve şeffaf şekilde cache'lemek için `get`'i yakalayın.

**Değişiklik takibi** — undo/redo sistemleri veya CRDT tabanlı senkronizasyon için mutasyonların diff logunu biriktirin.

**API client'ları** — `api.users.byId(3).posts` gibi herhangi bir property erişim zincirinin dinamik olarak URL yolu oluşturduğu bir proxy inşa edin.

## Bilinmesi Gereken Sınırlamalar

Proxy'lerin performans maliyeti vardır. Her yakalanan operasyon ek yük ekler. Frame başına binlerce operasyonun olduğu sıcak yollar için bu önemlidir. Bazı yerleşik nesnelerin (`Map`, `Set`, `Date`) Proxy'lerin yakalayamadığı dahili slot'ları vardır — metotlarını açıkça sarmanız gerekir. Ve `Proxy` polyfill yapılamaz; ES5 eşdeğeri yoktur.

Proxy'leri anlamak, modern framework'lerin nasıl çalıştığına röntgen görüşü kazandırır ve kendi soyutlamalarınız için güçlü pattern'ler açar.
