<script setup lang="ts">
import { MessageCircle, Share, Rss, Link2 } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import MisskeyIcon from '../svg/MisskeyIcon.vue'
import XIcon from '../svg/XIcon.vue'
import ArticleLike from './ArticleLike.vue'

const props = defineProps<{
  articleId: string
  showRss?: boolean
  isVertical?: boolean
}>()

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
    <ArticleLike
      :article-id="articleId"
      :layout="isVertical ? 'vertical' : 'regular'"
    />

    <!-- Comment scroll -->
    <button
      @click="scrollToComments"
      class="m3-state-layer flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-blue-400"
      title="コメント欄へ"
    >
      <MessageCircle class="w-7 h-7" />
    </button>

    <!-- Share -->
    <div ref="shareRef" class="relative">
      <button
        @click="shareOpen = !shareOpen"
        class="m3-state-layer flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground transition-colors"
        :class="
          shareOpen
            ? 'bg-primary-container text-primary-container-foreground'
            : 'hover:text-foreground'
        "
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
          class="absolute z-10 flex gap-5 rounded-3xl border border-border/40 bg-surface-container-high shadow-[var(--elevation-2)]"
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
      class="m3-state-layer flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-orange-400"
      title="RSSフィードを開く"
    >
      <Rss class="w-7 h-7" />
    </button>

  </div>
</template>
