# sfb.dev - Kişisel Web Sitesi

## Proje Tanımı

Şefik Furkan Bayram'ın kişisel web sitesi. Projeler ve blog yazıları yayınlanır.
Domain: **sfb.dev**

## Tasarım Felsefesi

[no-style-please](https://riggraz.dev/no-style-please/) temasından ilham alınmıştır:
- **Minimalist ve metin odaklı** — gereksiz görsellik yok, içerik ön planda
- **Neredeyse sıfır CSS** — sadece temel tipografi ve okunabilirlik için minimum stil
- **Hızlı** — minimum bağımlılık, sade yapı
- **Koyu/açık tema desteği** — `prefers-color-scheme` ile otomatik

## Teknoloji

- **Nuxt 3** — Vue 3 tabanlı, statik site üretimi (SSG) ile
- **Nuxt Content** — Markdown dosyalarından blog yazıları ve sayfalar
- Deploy: **GitHub Pages** veya **Vercel/Netlify** (statik çıktı)
- Harici UI kütüphanesi kullanılmaz (Vuetify, Tailwind vb. yok)
- JavaScript/CSS minimum — karmaşık interaksiyon yok

## Yapı

```
/
├── content/
│   ├── blog/              # Blog yazıları (.md)
│   └── projects/          # Proje tanımları (.md)
├── pages/
│   ├── index.vue          # Ana sayfa
│   ├── blog/
│   │   ├── index.vue      # Blog listesi
│   │   └── [...slug].vue  # Blog detay
│   ├── projects.vue       # Projeler sayfası
│   └── about.vue          # Hakkımda
├── layouts/
│   └── default.vue        # Ana layout (header + footer)
├── components/            # Ortak bileşenler (varsa)
├── public/
│   └── cv.pdf             # CV dosyası
├── assets/
│   └── css/
│       └── main.css       # Tek stil dosyası (minimal)
├── nuxt.config.ts
├── package.json
└── CLAUDE.md
```

## İçerik Kuralları

- Blog yazıları `content/blog/` altına `.md` olarak eklenir
- Front matter: `title`, `date`, `description` (opsiyonel: `categories`)
- Projeler `content/projects/` altına `.md` olarak eklenir
- Dil: Türkçe veya İngilizce — yazının diline göre

## Stil Kuralları

- Tek bir CSS dosyası, minimum kurallar
- Harici font yok — sistem fontları (`system-ui, sans-serif`)
- Renk paleti: arka plan, metin, link — o kadar
- Responsive: doğal akışla, medya sorgusu minimumda
- Görsel kullanımı minimum

## Navigasyon

- Ana sayfa (son yazılar)
- Blog
- Projeler
- Hakkımda

## Geliştirme

```bash
npm run dev        # Yerel geliştirme
npm run generate   # Statik site üretimi
```

## Notlar

- `list.m3u` dosyası proje ile ilgisiz, temizlenebilir
- `cv.pdf` → `public/cv.pdf` olarak taşınacak
- Eski `index.html` yeni yapıya geçişte kaldırılacak
