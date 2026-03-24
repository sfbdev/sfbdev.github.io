export default defineNuxtConfig({
  compatibilityDate: '2025-03-24',
  future: { compatibilityVersion: 4 },
  modules: ['@nuxt/content', '@nuxtjs/i18n'],
  app: {
    head: {
      title: 'sfb.dev',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Şefik Furkan Bayram - Front-end Developer' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  i18n: {
    locales: [
      { code: 'en', name: 'EN', language: 'en-US', file: 'en.json' },
      { code: 'tr', name: 'TR', language: 'tr-TR', file: 'tr.json' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    detectBrowserLanguage: false
  },
  content: {
    renderer: {
      anchorLinks: false
    }
  },
  nitro: {
    preset: 'static',
    output: {
      publicDir: 'dist'
    }
  }
})
