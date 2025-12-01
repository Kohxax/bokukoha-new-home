<script setup>
import BackToTop from '~/components/partials/BackToTop.vue'
</script>

<template>
  <AppHeader />
  <BackToTop />
  <div class="min-h-screen">
    <slot />
  </div>
  <ImageViewer />
</template>
