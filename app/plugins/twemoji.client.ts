import twemoji from '@twemoji/api'

export default defineNuxtPlugin((nuxtApp) => {
  const parseEmoji = () => {
    twemoji.parse(document.body, {
      folder: 'svg',
      ext: '.svg',
      base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/',
    })
  }

  nuxtApp.hook('page:finish', () => {
    nextTick(() => {
      parseEmoji()
    })
  })

  nuxtApp.hook('app:mounted', () => {
    parseEmoji()
  })
})
