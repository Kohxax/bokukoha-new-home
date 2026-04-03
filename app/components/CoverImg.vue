<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  src: string | undefined | null
  articlePath: string
  alt?: string
}>()

// 相対パス（contentディレクトリ起源）かどうか
const isContentImage = computed(() => {
  const s = props.src
  return !!s && !s.startsWith('/') && !/^https?:\/\//.test(s)
})

const resolvedSrc = computed(() => resolveCoverImage(props.src, props.articlePath) ?? '')
</script>

<template>
  <!-- contentディレクトリの画像はNuxtImg(IPX)を経由せずimgタグで直接読み込む -->
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
