<script setup lang="ts">
import { Heart } from 'lucide-vue-next'

const props = defineProps({
  articleId: {
    type: String,
    required: true,
  },
  isVertical: {
    type: Boolean,
    default: false,
  },
  isCompact: {
    type: Boolean,
    default: false,
  },
})

const likeCount = ref<number | null>(null)
const liked = ref(false)
const LIMIT = 1

const config = useRuntimeConfig()
const apiEndpoint = config.public.likeApi
const apiKey = config.public.likeApiKey

const localKey = `user_like_count_${props.articleId}`

onMounted(async () => {
  const userLikes = parseInt(localStorage.getItem(localKey) || '0')
  if (userLikes >= LIMIT) liked.value = true

  try {
    const res = await fetch(`${apiEndpoint}/${encodeURIComponent(props.articleId)}`, {
      headers: { 'x-api-key': apiKey },
    })
    const data = await res.json()
    likeCount.value = data.likes || 0
  } catch (e: any) {
    console.error(`Failed to fetch likes for ${props.articleId}:`, e.message || String(e))
    likeCount.value = 0
  }
})

const handleLike = async () => {
  if (liked.value) return

  liked.value = true
  likeCount.value = (likeCount.value || 0) + 1
  localStorage.setItem(localKey, '1')

  const id = props.articleId
  await fetch(`${apiEndpoint}/${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey },
  })
}
</script>

<template>
  <div :class="isCompact ? 'inline-flex' : 'flex flex-col items-center'">
    <button
      @click="handleLike"
      class="flex transition-all select-none"
      :class="[
        liked ? 'text-muted-foreground opacity-70 cursor-not-allowed' : '',
        isCompact
          ? 'items-center gap-1.5 rounded-md px-2.5 py-1 text-sm hover:bg-muted/40 border border-border/50'
          : isVertical
            ? 'flex-col items-center gap-1 p-2 text-xl hover:bg-muted/50 rounded-xl'
            : 'items-center gap-3 rounded-3xl px-6 py-4 text-2xl hover:bg-muted/30',
      ]"
    >
      <Heart
        :class="[
          isCompact ? 'w-4 h-4' : isVertical ? 'w-7 h-7' : 'w-9 h-9',
          liked
            ? 'text-muted-foreground fill-muted-foreground'
            : 'text-red-400 fill-red-400 hover:scale-110',
        ]"
      />
      <template v-if="likeCount === null">
        <span
          class="bg-muted animate-pulse rounded-md"
          :class="isCompact ? 'h-4 w-3' : isVertical ? 'h-6 w-5' : 'h-8 w-6'"
        ></span>
      </template>
      <transition v-else name="like-bump" mode="out-in">
        <span :key="likeCount">{{ likeCount }}</span>
      </transition>
    </button>
  </div>
</template>

<style scoped>
.like-bump-enter-active {
  transition: all 0.28s ease;
}

.like-bump-leave-active {
  transition: all 0.2s ease;
}

.like-bump-enter-from {
  transform: translateY(6px);
  opacity: 0;
}

.like-bump-leave-to {
  transform: translateY(-6px);
  opacity: 0;
}
</style>
