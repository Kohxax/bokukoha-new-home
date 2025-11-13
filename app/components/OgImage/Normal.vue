<script setup lang="ts">

import { useSiteConfig } from '#site-config/app/composables'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  website?: string
}>(), {
  title: 'title',
})

const website = computed(() => {
  if (props.website) return props.website
  const siteUrl = useSiteConfig().url
  try {
    return siteUrl ? new URL(siteUrl).host : ''
  } catch {
    return siteUrl || ''
  }
})
</script>

<template>
  <div class="h-full w-full flex items-start justify-start border-solid border-blue-500 border-12 bg-gray-50">
    <div class="flex items-start justify-start h-full">
      <div class="flex flex-col justify-between w-full h-full">
        <h1 class="text-[80px] p-20 font-black text-left" style="display: block; line-clamp: 2; text-overflow: ellipsis;">
          {{ title }}
        </h1>
        <p class="text-2xl pb-10 px-20 font-bold mb-0" style="display: block; line-clamp: 3; text-overflow: ellipsis;">
          {{ website }}
        </p>
      </div>
    </div>
  </div>
</template>