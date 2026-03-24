export default defineNuxtConfig({
  compatibilityDate: '2025-03-24',
  future: { compatibilityVersion: 4 },
  modules: ['@nuxt/content'],
  app: {
    head: {
      title: 'sfb.dev',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Şefik Furkan Bayram -  Front-end Developer' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
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
