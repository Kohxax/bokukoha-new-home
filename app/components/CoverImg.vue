<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  src: string | undefined | null
  articlePath: string
  alt?: string
}>()

const isContentImage = computed(() => {
  const s = props.src
  return !!s && !s.startsWith('/') && !/^https?:\/\//.test(s)
})

const resolvedSrc = computed(() => resolveCoverImage(props.src, props.articlePath) ?? '')
</script>

<template>
  <img
    v-if="isContentImage"
    :src="resolvedSrc"
    :alt="alt"
    v-bind="$attrs"
    loading="lazy"
  />
  <NuxtImg
    v-else
    :src="resolvedSrc"
    :alt="alt"
    v-bind="$attrs"
  />
</template>
