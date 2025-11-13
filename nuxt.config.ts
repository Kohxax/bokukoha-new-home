// https://nuxt.com/docs/api/configuration/nuxt-config

import taillwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  modules: ['@nuxtjs/seo','shadcn-nuxt', '@nuxt/content'],

  site: {
    url: 'https://www.bokukoha.dev',
    name: 'ぼくこは.dev'
  },

  sitemap: {
    xsl: false,
    credits: false,
  },

  ogImage: {
    fonts: ['Noto+Sans+JP:700'],
  },

  experimental: {
    viewTransition: true,
  },

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },

  runtimeConfig: {
    public: {
      likeApi: process.env.NUXT_PUBLIC_LIKE_API,
      likeApiKey: process.env.NUXT_PUBLIC_LIKE_API_KEY,
    },
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  content: {
    renderer: {
      anchorLinks: false
    }
  },

  vite: {
    plugins: [
      taillwindcss(),
    ],
  },

  nitro: {
    preset:'cloudflare-pages'
  },

  shadcn: {
    prefix: '',
    componentDir: '~/components/ui',
  },
})