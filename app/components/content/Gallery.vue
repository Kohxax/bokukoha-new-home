<script setup lang="ts">
import { ChevronRight, ChevronLeft } from 'lucide-vue-next'

const props = defineProps<{
  images: string[]
  autoDelay?: number
}>()

const images = props.images || []
const autoDelay = props.autoDelay ?? 5000
const currentIndex = ref(0)
const container = ref<HTMLElement | null>(null)
let intervalId: ReturnType<typeof setInterval> | null = null
const autoSlideEnabled = ref(true)

const scrollToIndex = (index: number) => {
  if (!container.value) return
  const width = container.value.clientWidth
  container.value.scrollTo({
    left: width * index,
    behavior: 'smooth',
  })
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    stopAutoSlide()
  }
}
const next = (manual = false) => {
  if (currentIndex.value < images.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
  if (manual) {
    stopAutoSlide()
  }
}

const stopAutoSlide = () => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
    autoSlideEnabled.value = false
  }
}

watch(currentIndex, (newIndex) => {
  scrollToIndex(newIndex)
})

onMounted(() => {
  scrollToIndex(currentIndex.value)
  if (images.length > 1) {
    intervalId = setInterval(() => {
      if (autoSlideEnabled.value) {
        next(false)
      }
    }, autoDelay)
  }
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="relative w-full overflow-hidden group mb-7">
    <div
      ref="container"
      class="gallery content-media-frame flex aspect-video snap-x snap-mandatory overflow-x-auto scroll-smooth"
    >
      <div
        v-for="(img, idx) in images"
        :key="idx"
        class="flex-none w-full h-full object-cover object-center snap-start"
      >
        <NuxtImg
          :src="img"
          :alt="`Gallery image ${idx + 1}`"
          class="w-full h-full m-0! object-cover object-center"
          loading="lazy"
        />
      </div>
    </div>

    <div class="flex justify-center gap-2 mt-3">
      <button
        v-for="(img, idx) in images"
        :key="idx"
        type="button"
        @click="((currentIndex = idx), stopAutoSlide())"
        :aria-label="`${idx + 1}枚目の画像を表示`"
        :aria-current="currentIndex === idx ? 'true' : undefined"
        :class="[
          'size-2.5 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          currentIndex === idx ? 'bg-primary' : 'bg-surface-container-highest hover:bg-primary/60',
        ]"
      />
    </div>

    <Button
      v-if="currentIndex > 0"
      variant="secondary"
      size="icon"
      class="absolute left-2 top-1/2 -translate-y-1/2 opacity-80 transition-opacity group-hover:opacity-100"
      aria-label="前の画像"
      @click="prev"
    >
      <ChevronLeft />
    </Button>

    <Button
      v-if="images.length > 1"
      variant="secondary"
      size="icon"
      class="absolute right-2 top-1/2 -translate-y-1/2 opacity-80 transition-opacity group-hover:opacity-100"
      aria-label="次の画像"
      @click="next(true)"
    >
      <ChevronRight />
    </Button>
  </div>
</template>

<style scoped>
.gallery {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.gallery::-webkit-scrollbar {
  display: none;
}
</style>
