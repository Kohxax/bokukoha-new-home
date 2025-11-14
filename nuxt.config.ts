// https://nuxt.com/docs/api/configuration/nuxt-config

import taillwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  modules: ['@nuxtjs/seo', 'shadcn-nuxt', '@nuxt/content'],

  site: {
    url: 'https://www.bokukoha.dev',
    name: 'ぼくこは.dev',
    trailingSlash: true,
  },

  ogImage: {
    enabled: false
  },

  seo: {
    meta: {
      description: 'ぼくこは.devはこはのプロフィールやブログ記事、ポートフォリオをまとめた個人サイトです。',
      themeColor: {
        content: '#18181b',
      },
      twitterCreator: '@kohxax',
      author: 'Koha',
      colorScheme: 'dark',
      applicationName: 'ぼくこは.dev',

      ogSiteName: 'ぼくこは.dev',
      ogLocale: 'ja',
      ogType: 'website',
      ogUrl: 'https://www.bokukoha.dev',

      ogImage: 'https://www.bokukoha.dev/images/og/coverImage.png',
      robots: 'index, follow'
    },
  },

  sitemap: {
    xsl: false,
    credits: false,
  },

  experimental: {
    viewTransition: true,
    defaults: {
      nuxtLink: {
        trailingSlash: 'append',
      }
    }
  },

  watch: ['content/**'],

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
      siteURL: 'https://www.bokukoha.dev'
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
    },
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark',
          langs: [
            'java',
            'kotlin',
            'json',
            'js',
            'ts',
            'html',
            'css',
            'vue',
            'md',
            'yaml'
          ],
        },
      },
    },
  },

  vite: {
    plugins: [
      taillwindcss(),
    ],
    server: {
      watch: {
        usePolling: true,
      },
    },
  },

  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/sitemap.xml', '/rss.xml', '/']
    },
  },

  shadcn: {
    prefix: '',
    componentDir: '~/components/ui',
  },
})