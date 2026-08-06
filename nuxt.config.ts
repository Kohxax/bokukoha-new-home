// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite'
import { cpSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  modules: ['@nuxtjs/seo', 'shadcn-nuxt', '@nuxt/content', '@nuxt/image'],

  site: {
    url: 'https://www.bokukoha.dev',
    name: 'ぼくこは.dev',
    trailingSlash: true,
  },

  ogImage: {
    enabled: false,
  },

  seo: {
    meta: {
      description:
        'ぼくこは.devはこはのプロフィールやブログ記事、ポートフォリオをまとめた個人サイトです。',
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
      robots: 'index, follow',
    },
  },

  sitemap: {
    xsl: false,
    credits: false,
  },

  experimental: {
    defaults: {
      nuxtLink: {
        trailingSlash: 'append',
      },
    },
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
      commentApi: process.env.NUXT_PUBLIC_COMMENT_API,
      commentApiKey: process.env.NUXT_PUBLIC_COMMENT_API_KEY,
      siteURL: 'https://www.bokukoha.dev',
      posthogPublicKey: 'phc_oQSYqHltZoWuFStVSNCP9GzO253LCZJXhDttSTR4ZuT',
      posthogHost: 'https://us.i.posthog.com',
      posthogDefaults: '2025-05-24',
    },
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  content: {
    renderer: {
      anchorLinks: false,
    },
    build: {
      markdown: {
        toc: {
          depth: 4,
          searchDepth: 4,
        },
        highlight: {
          theme: 'github-dark',
          langs: ['java', 'kotlin', 'json', 'js', 'ts', 'html', 'css', 'vue', 'md', 'yaml'],
        },
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,
      },
    },
  },

  hooks: {
    'build:before': () => {
      const IMAGE_EXTS = /\.(jpe?g|png|gif|webp|svg|avif)$/i
      const contentDir = join(process.cwd(), 'content')
      const publicDir = join(process.cwd(), 'public')

      const copyImages = (src: string, dest: string) => {
        if (!existsSync(src)) return
        cpSync(src, dest, {
          recursive: true,
          filter: (srcPath) => {
            const isDir = !srcPath.includes('.')
            return isDir || IMAGE_EXTS.test(srcPath)
          },
        })
      }

      copyImages(join(contentDir, 'blog'), join(publicDir, 'images', 'blog'))
      copyImages(join(contentDir, 'work'), join(publicDir, 'images', 'work'))
    },
  },

  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/sitemap.xml', '/rss.xml', '/', '/api/related.json'],
    },
  },

  shadcn: {
    prefix: '',
    componentDir: '~/components/ui',
  },
})
