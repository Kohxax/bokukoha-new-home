// https://nuxt.com/docs/api/configuration/nuxt-config

import taillwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],

  experimental: {
    viewTransition: true,
  },

  vite: {
    plugins: [
      taillwindcss(),
    ],
  },

  nitro: {
    preset:'cloudflare-pages'
  },

  modules: ['shadcn-nuxt', '@nuxt/content'],

  shadcn: {
    prefix: '',
    componentDir: '~/components/ui',
  },
})