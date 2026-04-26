<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  src: string | undefined | null
  alt?: string
}>()
</script>

<template>
  <NuxtImg
    :src="src ?? undefined"
    :alt="alt"
    v-bind="$attrs"
    loading="lazy"
  />
</template>
