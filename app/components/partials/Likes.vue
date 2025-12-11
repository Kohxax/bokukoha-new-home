<script setup>
import { Heart } from 'lucide-vue-next'

const likes = 1
</script>

<template>
  <div class="container flex flex-row gap-1.5 text-foreground items-center w-10 justify-center">
    <Heart class="w-5 h-5" />
    <span class="text-md">{{ likes }}</span>
  </div>
</template>
