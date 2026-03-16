import twemoji from '@twemoji/api'

export default defineNuxtPlugin((nuxtApp) => {
  // SSG/SSR で事前レンダリングされた HTML（F5時）の絵文字をカバーする
  nuxtApp.hook('app:mounted', () => {
    nextTick(() => {
      twemoji.parse(document.body, {
        folder: 'svg',
        ext: '.svg',
        base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/',
      })
    })
  })
})
