<script setup lang="ts" async>
import { Heart } from 'lucide-vue-next'

const props = defineProps({
  articleId: {
    type: String,
    required: true,
  },
})

const config = useRuntimeConfig()
const apiEndpoint = config.public.likeApi
const apiKey = config.public.likeApiKey

const { data: likeCount } = await useAsyncData(
  `likes-${props.articleId}`,
  () =>
    $fetch(`${apiEndpoint}/${encodeURIComponent(props.articleId)}`, {
      headers: { 'x-api-key': apiKey },
    })
      .then((res: any) => res.likes || 0)
      .catch((e: any) => {
        console.error(`Failed to fetch likes for ${props.articleId}:`, e.message || String(e))
        return 0
      }),
  {
    lazy: true,
    server: true,
    default: () => 0,
  },
)
</script>

<template>
  <div class="container text-foreground/80 flex flex-row gap-1.5 items-center w-9 justify-center">
    <Heart class="w-4 h-4" />
    <span class="text-base">{{ likeCount }}</span>
  </div>
</template>
