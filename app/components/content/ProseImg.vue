<template>
  <figure class="my-6">
    <NuxtImg
      :src="src"
      :alt="alt"
      class="rounded-lg shadow mx-auto cursor-pointer transition-transform hover:scale-[1.005]"
      loading="lazy"
      @click="open(src)"
    />

    <figcaption
      v-if="alt"
      class="text-md text-center text-muted-foreground mt-2 break-words"
      v-html="linkifyText(alt)"
    />
  </figure>
</template>

<script setup lang="ts">
import { linkifyText } from '~/composables/useLinkify'

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

const { $imageViewer } = useNuxtApp()
const { open, register, unregister } = $imageViewer

onMounted(() => {
  if (props.src) {
    register(props.src, props.alt)
  }
})

onUnmounted(() => {
  if (props.src) {
    unregister(props.src)
  }
})
</script>
