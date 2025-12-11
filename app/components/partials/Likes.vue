<script setup>
import { Heart } from 'lucide-vue-next'

const props = defineProps({
  colorClass: {
    type: String,
    default: 'text-foreground',
  },
})

const likes = 1
</script>

<template>
  <div class="container flex flex-row gap-1.5 items-center w-10 justify-center" :class="colorClass">
    <Heart class="w-4 h-4" />
    <span class="text-base">{{ likes }}</span>
  </div>
</template>
