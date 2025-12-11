<script setup>
import { Heart } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'

const props = defineProps({
  articleId: {
    type: String,
    required: true,
  },
})

const likeCount = ref(0)
const config = useRuntimeConfig()
const apiEndpoint = config.public.likeApi
const apiKey = config.public.likeApiKey

onMounted(async () => {
  try {
    const res = await fetch(`${apiEndpoint}/${encodeURIComponent(props.articleId)}`, {
      headers: { 'x-api-key': apiKey },
    })
    const data = await res.json()
    likeCount.value = data.likes || 0
  } catch (e) {
    console.error('Failed to fetch likes', e)
  }
})
</script>

<template>
  <div class="container text-foreground/80 flex flex-row gap-1.5 items-center w-9 justify-center">
    <Heart class="w-4 h-4" />
    <span class="text-base">{{ likeCount }}</span>
  </div>
</template>
