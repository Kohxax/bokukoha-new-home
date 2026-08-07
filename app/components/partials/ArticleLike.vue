<script setup lang="ts">
import { Heart } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    articleId: string
    interactive?: boolean
    layout?: 'compact' | 'regular' | 'vertical'
  }>(),
  {
    interactive: true,
    layout: 'regular',
  },
)

const config = useRuntimeConfig()
const likeCount = useState<number | null>(`article-like-count:${props.articleId}`, () => null)
const liked = useState<boolean>(`article-liked:${props.articleId}`, () => false)
const loading = useState<boolean>(`article-like-loading:${props.articleId}`, () => false)
const submitting = ref(false)
const localKey = `user_like_count_${props.articleId}`

const layoutClass = computed(() => {
  if (props.layout === 'compact') {
    return props.interactive
      ? 'min-h-8 gap-1.5 rounded-full px-2.5 py-1 text-sm'
      : 'w-9 gap-1.5 text-base'
  }

  if (props.layout === 'vertical') {
    return 'min-h-12 min-w-12 flex-col gap-1 rounded-full p-2 text-base'
  }

  return 'min-h-12 gap-2 rounded-full px-3 py-2 text-base'
})

onMounted(async () => {
  liked.value = Number.parseInt(localStorage.getItem(localKey) || '0', 10) >= 1

  if (likeCount.value !== null || loading.value) return

  loading.value = true
  try {
    const response = await fetch(
      `${config.public.likeApi}/${encodeURIComponent(props.articleId)}`,
      { headers: { 'x-api-key': config.public.likeApiKey } },
    )
    const data = await response.json()
    likeCount.value = data.likes || 0
  } catch (error) {
    console.error(`Failed to fetch likes for ${props.articleId}:`, error)
    likeCount.value = 0
  } finally {
    loading.value = false
  }
})

const handleLike = async () => {
  if (!props.interactive || liked.value || submitting.value) return

  const previousCount = likeCount.value || 0
  submitting.value = true
  liked.value = true
  likeCount.value = previousCount + 1
  localStorage.setItem(localKey, '1')

  try {
    const response = await fetch(
      `${config.public.likeApi}/${encodeURIComponent(props.articleId)}`,
      {
        method: 'POST',
        headers: { 'x-api-key': config.public.likeApiKey },
      },
    )
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
  } catch (error) {
    liked.value = false
    likeCount.value = previousCount
    localStorage.removeItem(localKey)
    console.error(`Failed to like ${props.articleId}:`, error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <component
    :is="interactive ? 'button' : 'span'"
    :type="interactive ? 'button' : undefined"
    :disabled="interactive ? liked || submitting : undefined"
    :aria-pressed="interactive ? liked : undefined"
    :aria-label="interactive ? (liked ? 'いいね済み' : 'いいねする') : 'いいね数'"
    :class="[
      'inline-flex items-center justify-center tabular-nums transition-[background-color,color,transform] select-none',
      interactive ? 'm3-state-layer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring' : 'text-muted-foreground',
      interactive && liked
        ? 'cursor-not-allowed bg-destructive/15 text-destructive'
        : interactive
          ? 'text-muted-foreground hover:text-foreground'
          : '',
      layoutClass,
    ]"
    @click="handleLike"
  >
    <Heart
      :class="[
        layout === 'compact' ? 'size-4' : 'size-7',
        liked ? 'fill-current' : 'fill-transparent',
      ]"
      aria-hidden="true"
    />
    <span
      v-if="likeCount === null"
      class="inline-block h-4 w-5 animate-pulse rounded bg-muted"
      aria-label="読み込み中"
    />
    <Transition v-else name="like-bump" mode="out-in">
      <span :key="likeCount">{{ likeCount }}</span>
    </Transition>
  </component>
</template>

<style scoped>
.like-bump-enter-active {
  transition: all 0.28s ease;
}

.like-bump-leave-active {
  transition: all 0.2s ease;
}

.like-bump-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.like-bump-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
