export default defineNuxtConfig({
  devtools: {
    enabled: false
  },
  devServer: {
    host: process.env.NUXT_HOST || '0.0.0.0',
    port: Number(process.env.NUXT_PORT) || 3000,
  },

  vite: {
    server: {
      allowedHosts: true,
    }
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
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    }
  }
})
