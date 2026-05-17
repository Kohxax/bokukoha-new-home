<script setup lang="ts">
import { Heart, MessageCircle, Share, Rss, Link2 } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import MisskeyIcon from '../svg/MisskeyIcon.vue'
import XIcon from '../svg/XIcon.vue'

const props = defineProps<{
  articleId: string
  showRss?: boolean
  isVertical?: boolean
}>()

// ── Like ──────────────────────────────────────────────
const config = useRuntimeConfig()
const likeCount = ref<number | null>(null)
const liked = ref(false)
const LIMIT = 1
const localKey = computed(() => `user_like_count_${props.articleId}`)

onMounted(async () => {
  liked.value = parseInt(localStorage.getItem(localKey.value) || '0') >= LIMIT
  try {
    const res = await fetch(
      `${config.public.likeApi}/${encodeURIComponent(props.articleId)}`,
      { headers: { 'x-api-key': config.public.likeApiKey } },
    )
    likeCount.value = (await res.json()).likes || 0
  } catch {
    likeCount.value = 0
  }
})

const handleLike = async () => {
  if (liked.value) return
  liked.value = true
  likeCount.value = (likeCount.value || 0) + 1
  localStorage.setItem(localKey.value, '1')
  await fetch(`${config.public.likeApi}/${encodeURIComponent(props.articleId)}`, {
    method: 'POST',
    headers: { 'x-api-key': config.public.likeApiKey },
  })
}

// ── Comment scroll ─────────────────────────────────────
const scrollToComments = () => {
  document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })
}

// ── Share ──────────────────────────────────────────────
const shareOpen = ref(false)
const shareRef = ref<HTMLElement | null>(null)

onClickOutside(shareRef, () => { shareOpen.value = false })

const copyLink = async () => {
  await navigator.clipboard.writeText(window.location.href).catch(() => {})
  shareOpen.value = false
}
const shareToX = () => {
  window.open(
    `https://x.com/intent/tweet?text=${encodeURIComponent(document.title)}&url=${encodeURIComponent(window.location.href)}`,
    '_blank', 'width=500,height=400',
  )
  shareOpen.value = false
}
const shareToMisskey = () => {
  window.open(
    `https://misskeyshare.link/share.html?text=${encodeURIComponent(document.title)}&url=${encodeURIComponent(window.location.href)}`,
    '_blank', 'width=500,height=400',
  )
  shareOpen.value = false
}

// ── RSS ────────────────────────────────────────────────
const openRSS = () => window.open('https://www.bokukoha.dev/rss.xml', '_blank')
</script>

<template>
  <div :class="isVertical ? 'flex flex-col items-center gap-1' : 'flex items-center justify-center gap-3'">

    <!-- Like -->
    <button
      @click="handleLike"
      :disabled="liked"
      class="rounded-xl p-2 transition-all select-none"
      :class="[
        isVertical ? 'flex flex-col items-center gap-1' : 'flex items-center gap-2',
        liked ? 'text-muted-foreground cursor-not-allowed' : 'hover:bg-muted/30',
      ]"
      title="いいね"
    >
      <Heart
        class="w-7 h-7"
        :class="liked ? 'fill-muted-foreground text-muted-foreground' : 'fill-red-400 text-red-400'"
      />
      <transition name="like-bump" mode="out-in">
        <span v-if="likeCount === null" class="inline-block w-5 h-4 rounded bg-muted animate-pulse" />
        <span v-else :key="likeCount" class="tabular-nums text-base">{{ likeCount }}</span>
      </transition>
    </button>

    <!-- Comment scroll -->
    <button
      @click="scrollToComments"
      class="p-2 rounded-xl text-muted-foreground transition-all hover:bg-muted/30 hover:text-blue-400"
      title="コメント欄へ"
    >
      <MessageCircle class="w-7 h-7" />
    </button>

    <!-- Share -->
    <div ref="shareRef" class="relative">
      <button
        @click="shareOpen = !shareOpen"
        class="p-2 rounded-xl text-muted-foreground transition-all"
        :class="shareOpen ? 'bg-muted/40 text-foreground' : 'hover:bg-muted/30 hover:text-foreground'"
        title="シェア"
      >
        <Share class="w-7 h-7" />
      </button>

      <!-- Share popover: 縦レイアウト時は右に、横レイアウト時は上に展開 -->
      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-100 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="shareOpen"
          class="absolute z-10 flex gap-5 rounded-2xl border border-border/60 bg-background shadow-lg"
          :class="isVertical
            ? 'flex-col left-full top-1/2 -translate-y-1/2 ml-2 px-3.5 py-6'
            : 'items-center bottom-full left-1/2 -translate-x-1/2 mb-2 px-6 py-3.5'"
        >
          <button @click="copyLink" class="text-muted-foreground hover:text-sky-400 transition-colors" title="リンクをコピー">
            <Link2 class="w-6 h-6" />
          </button>
          <button @click="shareToX" class="text-muted-foreground hover:text-foreground transition-colors" title="Xでシェア">
            <XIcon class="w-6 h-6 scale-93" />
          </button>
          <button @click="shareToMisskey" class="text-muted-foreground hover:text-green-400 transition-colors" title="Misskeyでシェア">
            <MisskeyIcon class="w-6 h-6" />
          </button>
        </div>
      </Transition>
    </div>

    <!-- RSS -->
    <button
      v-if="showRss"
      @click="openRSS"
      class="p-2 rounded-xl text-muted-foreground transition-all hover:bg-muted/30 hover:text-orange-400"
      title="RSSフィードを開く"
    >
      <Rss class="w-7 h-7" />
    </button>

  </div>
</template>

<style scoped>
.like-bump-enter-active { transition: all 0.28s ease; }
.like-bump-leave-active { transition: all 0.2s ease; }
.like-bump-enter-from { transform: translateY(6px); opacity: 0; }
.like-bump-leave-to { transform: translateY(-6px); opacity: 0; }
</style>
