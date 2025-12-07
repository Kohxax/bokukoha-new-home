<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  src: string
  description?: string
}>()

const embedUrl = computed(() => {
  if (!props.src) return ''

  // YouTube
  const youtubeMatch = props.src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Niconico
  const niconicoMatch = props.src.match(/(?:nicovideo\.jp\/watch\/|nico\.ms\/)((?:sm|nm|so)\d+)/)
  if (niconicoMatch) {
    return `https://embed.nicovideo.jp/watch/${niconicoMatch[1]}`
  }

  return null
})

const isNative = computed(() => {
  if (!props.src) return false
  // Check for common video extensions or if it's a relative path starting with /
  return /\.(mp4|webm|ogg|mov)$/i.test(props.src) || props.src.startsWith('/')
})
</script>

<template>
  <div class="my-8">
    <div class="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
      <video
        v-if="isNative"
        :src="src"
        controls
        playsinline
        preload="metadata"
        class="absolute -top-8 left-0 w-full h-full object-cover"
      ></video>
      <iframe
        v-else-if="embedUrl"
        :src="embedUrl"
        class="absolute top-0 left-0 w-full h-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
      <div v-else class="flex items-center justify-center w-full h-full text-white">
        Invalid Video URL
      </div>
    </div>
    <div class="mt-2 text-md text-center text-muted-foreground">
      <slot mdc-unwrap="p">{{ description }}</slot>
    </div>
  </div>
</template>
