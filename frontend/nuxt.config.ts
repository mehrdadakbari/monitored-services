export default defineNuxtConfig({
  devtools: {
    enabled: false
  },
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    scanPageMeta: true
  },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3333/api'
    }
  }
})
