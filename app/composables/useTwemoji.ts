import twemoji from '@twemoji/api'

export const TWEMOJI_OPTIONS = {
  folder: 'svg',
  ext: '.svg',
  base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/',
}

export const parseTwemoji = (el: HTMLElement = document.body) => {
  twemoji.parse(el, TWEMOJI_OPTIONS)
}

export const useTwemoji = () => {
  // コンポーネントのonMountedで呼ぶことで、子コンポーネント（ContentRenderer含む）の
  // マウント後に確実にtwemoji変換が走る
  onMounted(() => {
    nextTick(() => {
      parseTwemoji()
    })
  })

  return { parse: parseTwemoji }
}
