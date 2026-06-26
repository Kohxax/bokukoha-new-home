import twemoji from '@twemoji/api'
import { TWEMOJI_OPTIONS } from '~/composables/useTwemoji'

export default defineNuxtPlugin((nuxtApp) => {
  // SSG/SSR で事前レンダリングされた HTML（F5時）の絵文字をカバーする
  nuxtApp.hook('app:mounted', () => {
    nextTick(() => {
      twemoji.parse(document.body, TWEMOJI_OPTIONS)
    })
  })
})
