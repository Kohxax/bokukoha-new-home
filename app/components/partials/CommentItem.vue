<script setup lang="ts">
import { MessageSquare, Pin } from 'lucide-vue-next'
import CommentForm from './CommentForm.vue'
import { parseTwemoji } from '~/composables/useTwemoji'
import { linkifyText } from '~/composables/useLinkify'

export interface Comment {
  commentId: string
  articleId?: string
  authorName?: string
  authorId?: string
  content?: string
  parentId: string | null
  status: string
  isAdmin?: boolean
  pinned?: boolean
  createdAt: string
  replies: Comment[]
}

const props = defineProps<{
  comment: Comment
  articleId: string
  apiBase: string
  apiKey: string
}>()

const emit = defineEmits<{
  refresh: []
}>()

const REPLY_THRESHOLD = 2

const contentRef = ref<HTMLParagraphElement | null>(null)
const showReplyForm = ref(false)
const isContentExpanded = ref(false)
const isRepliesExpanded = ref(false)
const isLongContent = ref(false)

const checkOverflow = async () => {
  await nextTick()
  await document.fonts.ready
  if (contentRef.value) {
    isLongContent.value = contentRef.value.scrollHeight > contentRef.value.clientHeight
  }
}

onMounted(async () => {
  await checkOverflow()
  if (contentRef.value) parseTwemoji(contentRef.value)
})

const hasManyReplies = computed(() => props.comment.replies.length > REPLY_THRESHOLD)
const visibleReplies = computed(() =>
  hasManyReplies.value && !isRepliesExpanded.value
    ? props.comment.replies.slice(0, REPLY_THRESHOLD)
    : props.comment.replies,
)
const hiddenReplyCount = computed(() => props.comment.replies.length - REPLY_THRESHOLD)

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const isDeleted = computed(() => props.comment.status === 'deleted')

const contentHtml = computed(() =>
  props.comment.content ? linkifyText(props.comment.content) : '',
)

const hashStr = (s: string) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

// HSL→相対輝度（WCAG準拠）でテキスト色を決定
const avatarStyle = computed(() => {
  if (props.comment.isAdmin) return null
  const seed = props.comment.authorId ?? props.comment.authorName ?? '?'
  const hue = hashStr(seed) % 360
  const sat = (60 + (hashStr(seed + 's') % 20)) / 100 // 0.60–0.79
  const lit = (38 + (hashStr(seed + 'l') % 20)) / 100 // 0.38–0.57

  const hslChannel = (n: number) => {
    const k = (n + hue / 30) % 12
    return lit - sat * Math.min(lit, 1 - lit) * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const lum =
    0.2126 * toLinear(hslChannel(0)) +
    0.7152 * toLinear(hslChannel(8)) +
    0.0722 * toLinear(hslChannel(4))

  const onWhite = 1.05 / (lum + 0.05)
  const onBlack = (lum + 0.05) / 0.05

  return {
    backgroundColor: `hsl(${hue}, ${Math.round(sat * 100)}%, ${Math.round(lit * 100)}%)`,
    color: onWhite >= onBlack ? '#ffffff' : '#111827',
  }
})
</script>

<template>
  <!-- Deleted comment with remaining replies -->
  <div
    v-if="isDeleted && comment.replies.length > 0"
    :class="comment.parentId ? 'py-4 first:pt-0 last:pb-0' : 'rounded-2xl bg-surface-container-low p-4 sm:p-5'"
  >
    <p class="text-xs italic text-muted-foreground">このコメントは削除されました。</p>
    <div class="mt-4 ml-3 rounded-r-2xl border-l-2 border-primary/30 bg-surface-container-low/60 pl-4 sm:ml-5 sm:pl-5">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.commentId"
        :comment="reply"
        :article-id="articleId"
        :api-base="apiBase"
        :api-key="apiKey"
        @refresh="emit('refresh')"
      />
    </div>
  </div>

  <!-- Normal comment -->
  <div
    v-else-if="!isDeleted"
    :class="comment.parentId ? 'py-4 first:pt-0 last:pb-0' : 'rounded-2xl bg-surface-container-low p-4 sm:p-5'"
  >
    <div class="mb-3 flex items-center justify-between gap-3">
      <div class="flex min-w-0 flex-1 items-center gap-2">
        <!-- Avatar -->
        <div
          :style="comment.isAdmin ? undefined : (avatarStyle ?? undefined)"
          class="flex size-10 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-bold"
          :class="comment.isAdmin ? 'ring-2 ring-primary/40' : ''"
        >
          <template v-if="comment.isAdmin">
            <img src="~/assets/img/icon_glass.webp" alt="こは" class="w-full h-full object-cover" />
          </template>
          <template v-else>
            {{ comment.authorName?.charAt(0).toUpperCase() ?? '?' }}
          </template>
        </div>
        <span class="min-w-0 truncate text-sm font-medium">{{ comment.authorName }}</span>
        <span
          v-if="comment.isAdmin"
          class="inline-flex shrink-0 items-center rounded-full bg-primary-container px-1.5 py-0.5 text-[10px] font-medium text-primary-container-foreground"
          >管理者</span
        >
        <span
          v-else-if="comment.authorId"
          class="text-xs text-muted-foreground font-mono select-all shrink-0"
        >
          ID:{{ comment.authorId }}
        </span>
      </div>
      <Pin v-if="comment.pinned" class="size-4 shrink-0 text-amber-300" />
      <span class="shrink-0 whitespace-nowrap text-xs text-muted-foreground">{{
        formatDate(comment.createdAt)
      }}</span>
    </div>

    <div class="pl-12">
      <div class="relative">
        <p
          ref="contentRef"
          class="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word"
          :class="!isContentExpanded ? 'line-clamp-5' : ''"
          v-html="contentHtml"
        />

        <!-- Gradient fade -->
        <div
          v-if="isLongContent && !isContentExpanded"
          class="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-surface-container-low to-transparent"
        />
      </div>

      <!-- Expand button (centered, overlaps gradient bottom edge) -->
      <div
        v-if="isLongContent && !isContentExpanded"
        class="relative z-10 flex justify-center -mt-3"
      >
        <button
          type="button"
          aria-expanded="false"
          @click="isContentExpanded = true"
          class="m3-state-layer flex min-h-9 items-center gap-1.5 rounded-full border border-border/60 bg-surface-container-high px-4 py-2 text-xs text-foreground/80 shadow-sm transition-colors hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          もっと見る
        </button>
      </div>

      <!-- Close button (centered) when expanded -->
      <div v-if="isLongContent && isContentExpanded" class="flex justify-center mt-3">
        <button
          type="button"
          @click="isContentExpanded = false"
          class="m3-state-layer min-h-9 rounded-full px-4 py-2 text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          閉じる
        </button>
      </div>
    </div>

    <!-- Reply button (top-level only) -->
    <div v-if="!comment.parentId" class="mt-3 pl-12">
      <button
        type="button"
        :aria-expanded="showReplyForm"
        @click="showReplyForm = !showReplyForm"
        class="m3-state-layer flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MessageSquare class="size-4" />
        返信
      </button>
    </div>

    <!-- Inline reply form -->
    <div v-if="showReplyForm" class="mt-4 ml-12 border-t border-border/40 pt-4">
      <CommentForm
        :article-id="articleId"
        :parent-id="comment.commentId"
        :api-base="apiBase"
        :api-key="apiKey"
        @success="((showReplyForm = false), emit('refresh'))"
        @cancel="showReplyForm = false"
      />
    </div>

    <!-- Nested replies -->
    <div
      v-if="comment.replies.length > 0"
      class="mt-4 ml-3 rounded-r-2xl border-l-2 border-primary/30 bg-surface-container-low/60 pl-4 sm:ml-5 sm:pl-5"
    >
      <CommentItem
        v-for="reply in visibleReplies"
        :key="reply.commentId"
        :comment="reply"
        :article-id="articleId"
        :api-base="apiBase"
        :api-key="apiKey"
        @refresh="emit('refresh')"
      />

      <!-- Show more replies -->
      <div v-if="hasManyReplies && !isRepliesExpanded" class="flex justify-center py-3">
        <button
          type="button"
          :aria-expanded="false"
          @click="isRepliesExpanded = true"
          class="m3-state-layer flex min-h-9 items-center gap-1.5 rounded-full border border-border/60 bg-surface-container-high px-4 py-2 text-xs text-foreground/80 shadow-sm transition-colors hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          他{{ hiddenReplyCount }}件の返信を表示
        </button>
      </div>

      <!-- Collapse replies -->
      <div v-if="hasManyReplies && isRepliesExpanded" class="flex justify-center py-3">
        <button
          type="button"
          :aria-expanded="true"
          @click="isRepliesExpanded = false"
          class="m3-state-layer min-h-9 rounded-full px-4 py-2 text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          返信を折りたたむ
        </button>
      </div>
    </div>
  </div>
</template>
