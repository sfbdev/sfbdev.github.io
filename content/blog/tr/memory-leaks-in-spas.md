---
title: "Tek Sayfa Uygulamalarda Bellek Sızıntıları: Tespit, Kalıplar ve Önleme"
date: 2026-03-22
description: "En yaygın 5 SPA bellek sızıntısı kalıbı ve Chrome DevTools ile nasıl bulunacakları."
---

SPA'lar kendilerini temizlemek için sayfa yenilemesi almaz. Her navigasyon aynı process'te kalır. Zamanla bellek sızıntıları birikir ve sekme gigabyte'larca bellek tüketip tarayıcı onu öldürene kadar — ya da daha kötüsü, kullanıcılar uygulamayı terk edene kadar sessizce performansı düşürür.

SPA'lardaki bellek sızıntılarının çoğu bir avuç kalıba düşer. Bunları bilmek, tasarım gereği önleyebileceğiniz anlamına gelir.

## Kalıp 1: Ayrılmış DOM Ağaçları

Bir elementi DOM'dan kaldırırsınız ama bir şey hâlâ ona referans tutar — bir event listener closure'u, modül scope'undaki bir değişken, bir cache nesnesi. Element ve tüm alt ağacı bellekte kalır. Bu, bileşen tabanlı framework'lerdeki en yaygın sızıntıdır. Çözüm: teardown hook'larında her zaman referansları temizleyin (Vue'da `onUnmounted`, React'te `useEffect` cleanup).

## Kalıp 2: Unutulan Event Listener'lar ve Observer'lar

`window`, `document` veya bileşenin kendi ağacı dışındaki herhangi bir elemente `addEventListener` ekleyip unmount'ta kaldırmamak. Aynısı `IntersectionObserver`, `ResizeObserver`, `MutationObserver`, WebSocket handler'ları ve `setInterval` için de geçerlidir. Her biri callback closure'una referans tutar ve closure, scope zincirindeki her şeye referans tutar.

```javascript
// Vue 3 pattern'i — düzgün temizlik
import { onMounted, onUnmounted } from 'vue'

export function useWindowResize(callback) {
  const handler = () => callback(window.innerWidth, window.innerHeight)

  onMounted(() => window.addEventListener('resize', handler))
  onUnmounted(() => window.removeEventListener('resize', handler))
}
```

## Kalıp 3: Bileşen Scope'unu Yakalayan Closure'lar

Bir async operasyon (API çağrısı, setTimeout, animation frame döngüsü) bileşenin reaktif state'ine veya DOM ref'lerine referans tutan bir closure tutar. Bileşen async operasyon tamamlanmadan unmount olursa, closure ölü bileşenin tüm scope'unu canlı tutar. Fetch istekleri için `AbortController` kullanın ve diğer async işler için mounted durumunu takip edin.

## Kalıp 4: Global Store'larda Bayat Veri Birikimi

Pinia, Vuex, Redux — store'unuz her navigasyonda sınırsız büyüyorsa (her çekilen entity'yi cache'leme, array'lere ekleme, route'a özel veri saklama), bu bir sızıntıdır. Eviction stratejileri uygulayın: boyut sınırlı LRU cache'ler, route ayrılışında temizlik action'ları veya GC'nin girdileri geri almasına izin veren `WeakRef` tabanlı cache'ler.

## Kalıp 5: Üçüncü Parti Kütüphaneler

Harita kütüphaneleri (Leaflet, Mapbox), grafik kütüphaneleri (Chart.js, D3), zengin metin editörleri — birçoğu sadece DOM elementini kaldırarak serbest bırakılmayan dahili state tahsis eder. Açık destroy/dispose metotlarını çağırın.

## Tespit İş Akışı

Chrome DevTools → Memory sekmesini açın → heap snapshot alın. Uygulamanızda dolaşın. Başka bir snapshot alın. Snapshot'lar arasında neyin allocate edildiğini görmek için "Comparison" görünümünü kullanın. Toplanması gereken DOM node'larını bulmak için "Detached" ile filtreleyin. "Retainers" paneli size bir nesneyi canlı tutan referans zincirini gösterir — gerçek sızıntıyı burada bulursunuz.

Sistematik izleme için `performance.measureUserAgentSpecificMemory()` (origin-trial/COOP gerekli) kullanarak `jsHeapUsedSize`'ı zaman içinde takip edin. Grafiğe çizin. Sağlıklı bir SPA'nın belleği platoya ulaşmalıdır; sızıntılı olan yukarı doğru trend gösterir.

## WeakRef ve FinalizationRegistry

`WeakRef` ve `FinalizationRegistry`, garbage collection'ı engellemeyen cache pattern'leri oluşturmak için modern araçlardır. `WeakRef`, GC'yi engellemeyen bir referans tutar; `FinalizationRegistry`, bir nesne toplandığında temizlik kodu çalıştırmanıza izin verir. Geri almanın kabul edilebilir olduğu cache'ler için kullanın — asla kritik state için değil.

Bellek yönetimi gösterişli değildir, ama production-grade SPA'ları 20 dakika kullanımdan sonra bozulan demo'lardan ayıran şeydir.
