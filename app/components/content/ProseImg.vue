<template>
  <figure class="my-6">
    <img
      v-if="isContentImage"
      :src="resolvedSrc"
      :alt="alt"
      class="rounded-lg shadow mx-auto cursor-pointer transition-transform hover:scale-[1.005]"
      loading="lazy"
      @click="open(resolvedSrc)"
    />
    <NuxtImg
      v-else
      :src="resolvedSrc"
      :alt="alt"
      class="rounded-lg shadow mx-auto cursor-pointer transition-transform hover:scale-[1.005]"
      @click="open(resolvedSrc)"
    />

    <figcaption v-if="alt" class="text-md text-center text-muted-foreground mt-2">
      {{ alt }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
})

const route = useRoute()

const isContentImage = computed(() => {
  const src = props.src
  return !!src && !src.startsWith('/') && !/^https?:\/\//.test(src)
})

const resolvedSrc = computed(() => {
  const src = props.src
  if (!src || src.startsWith('/') || /^https?:\/\//.test(src)) return src
  const base = route.path.endsWith('/') ? route.path : route.path + '/'
  return base + src
})

const { $imageViewer } = useNuxtApp()
const { open, register, unregister } = $imageViewer

onMounted(() => {
  if (resolvedSrc.value) {
    register(resolvedSrc.value, props.alt)
  }
})

onUnmounted(() => {
  if (resolvedSrc.value) {
    unregister(resolvedSrc.value)
  }
})
</script>
