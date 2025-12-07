<template>
  <figure class="my-6">
    <NuxtImg
      :src="src"
      :alt="alt"
      format="webp"
      class="rounded-lg shadow mx-auto cursor-pointer transition-transform hover:scale-[1.005]"
      @click="open(optimizedSrc)"
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
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
})

const img = useImage()
const optimizedSrc = computed(() => {
  return img(props.src, { format: 'webp' })
})

const { $imageViewer } = useNuxtApp()
const { open, register, unregister } = $imageViewer

onMounted(() => {
  if (props.src) {
    register(optimizedSrc.value, props.alt)
  }
})

onUnmounted(() => {
  if (props.src) {
    unregister(optimizedSrc.value)
  }
})
</script>
