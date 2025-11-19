<script setup>
import { AlertTriangle } from 'lucide-vue-next'
</script>

<template>
  <div class="flex items-center p-3 rounded-lg bg-yellow-100 text-yellow-900 mb-3">
    <AlertTriangle class="h-5 w-5 mr-3 shrink-0" />

    <div class="grow text-md font-bold">
      <slot mdc-unwrap="p" />
    </div>
  </div>
</template>

<style scoped></style>
