<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
})

const liked = ref(false)
const LIMIT = 1

const config = useRuntimeConfig()
const apiEndpoint = config.public.likeApi
const apiKey = config.public.likeApiKey

const localKey = `user_like_count_${props.articleId}`

const { data: likeCount } = await useAsyncData(
  `like-button-${props.articleId}`,
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

onMounted(() => {
  const userLikes = parseInt(localStorage.getItem(localKey) || '0')
  if (userLikes >= LIMIT) liked.value = true
})

const handleLike = async () => {
  if (liked.value) return

  liked.value = true
  likeCount.value++
  localStorage.setItem(localKey, '1')

  const id = props.articleId
  await fetch(`${apiEndpoint}/${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey },
  })
}
</script>

<template>
  <div class="flex flex-col items-center">
    <button
      @click="handleLike"
      class="flex transition-all select-none"
      :class="[
        liked ? 'text-muted-foreground opacity-70 cursor-not-allowed' : '',
        isVertical
          ? 'flex-col items-center gap-1 p-2 text-xl hover:bg-muted/50 rounded-xl'
          : 'items-center gap-3 rounded-3xl px-6 py-4 text-2xl hover:bg-muted/30',
      ]"
    >
      <Heart
        :class="[
          isVertical ? 'w-7 h-7' : 'w-9 h-9',
          liked
            ? 'text-muted-foreground fill-muted-foreground'
            : 'text-red-400 fill-red-400 hover:scale-110',
        ]"
      />
      <transition name="like-bump" mode="out-in">
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
  position: absolute;
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
