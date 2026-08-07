<script setup lang="ts">
import ArticleLike from './ArticleLike.vue'

const props = withDefaults(
  defineProps<{
    articleId: string
    isVertical?: boolean
    isCompact?: boolean
  }>(),
  {
    isVertical: false,
    isCompact: false,
  },
)
</script>

<template>
  <ArticleLike
    :article-id="props.articleId"
    :layout="props.isCompact ? 'compact' : props.isVertical ? 'vertical' : 'regular'"
  />
</template>
