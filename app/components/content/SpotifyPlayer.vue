<script setup lang="ts">
import { useTemplateRef } from 'vue'

const props = defineProps<{
  src: string
  height?: number
}>()

const containerRef = useTemplateRef<HTMLElement>('container')
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!containerRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        isVisible.value = true
        observer?.disconnect()
        observer = null
      }
    },
    { rootMargin: '200px' },
  )
  observer.observe(containerRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

const embedInfo = computed(() => {
  const src = props.src?.trim()
  if (!src) return null

  // spotify:track:ID のような URI 形式
  const uriMatch = src.match(/^spotify:(track|album|playlist|artist|episode|show)\:([a-zA-Z0-9]+)/)
  if (uriMatch) {
    return { type: uriMatch[1]!, id: uriMatch[2]! }
  }

  // open.spotify.com の通常URL（ロケールプレフィックス付きにも対応）
  const urlMatch = src.match(
    /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|artist|episode|show)\/([a-zA-Z0-9]+)/,
  )
  if (urlMatch) {
    return { type: urlMatch[1]!, id: urlMatch[2]! }
  }

  return null
})

const embedUrl = computed(() => {
  if (!embedInfo.value) return null
  return `https://open.spotify.com/embed/${embedInfo.value.type}/${embedInfo.value.id}?utm_source=generator`
})

const embedHeight = computed(() => {
  if (props.height) return props.height
  if (!embedInfo.value) return 152
  return embedInfo.value.type === 'track' || embedInfo.value.type === 'episode' ? 152 : 352
})
</script>

<template>
  <figure ref="container" class="my-8">
    <iframe
      v-if="embedUrl && isVisible"
      :src="embedUrl"
      :height="embedHeight"
      width="100%"
      class="w-full rounded-xl shadow-xl"
      frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    ></iframe>
    <div
      v-else-if="embedUrl"
      class="w-full rounded-xl bg-muted animate-pulse"
      :style="{ height: `${embedHeight}px` }"
    ></div>
    <div v-else class="flex items-center justify-center w-full h-20 rounded-lg bg-black text-white">
      Invalid Spotify URL
    </div>

    <figcaption v-if="$slots.default" class="text-base text-center text-muted-foreground mt-2">
      <slot mdc-unwrap="p" />
    </figcaption>
  </figure>
</template>
