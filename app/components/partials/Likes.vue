<script setup lang="ts">
import ArticleLike from './ArticleLike.vue'

defineProps<{
  articleId: string
}>()
</script>

<template>
  <ArticleLike :article-id="articleId" layout="compact" :interactive="false" />
</template>
