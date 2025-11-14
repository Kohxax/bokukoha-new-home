<script setup>
</script>

<template>
  <code class="bg-muted rounded-sm px-1 text-foreground font-medium">
    <slot />
  </code>
</template>

<style scoped>
code::before,
code::after {
  content: none !important;
}
</style>