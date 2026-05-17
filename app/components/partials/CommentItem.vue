<script setup lang="ts">
import { MessageSquare } from 'lucide-vue-next'
import CommentForm from './CommentForm.vue'

export interface Comment {
  commentId: string
  articleId?: string
  authorName?: string
  authorId?: string
  content?: string
  parentId: string | null
  status: string
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
const isCollapsed = ref(false)
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

onMounted(checkOverflow)

watch(isCollapsed, (collapsed) => {
  if (!collapsed) checkOverflow()
})

const hasManyReplies = computed(() => props.comment.replies.length > REPLY_THRESHOLD)
const visibleReplies = computed(() =>
  hasManyReplies.value && !isRepliesExpanded.value
    ? props.comment.replies.slice(0, REPLY_THRESHOLD)
    : props.comment.replies
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
</script>

<template>
  <!-- Deleted comment with remaining replies -->
  <div v-if="isDeleted && comment.replies.length > 0" class="py-5">
    <p class="text-muted-foreground text-xs italic">このコメントは削除されました。</p>
    <div class="mt-3 ml-4 pl-4 border-l-2 border-muted divide-y divide-border/20">
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
  <div v-else-if="!isDeleted" class="py-5">
    <div class="flex items-center justify-between gap-2 mb-2">
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <!-- Avatar doubles as collapse toggle -->
        <button
          @click="isCollapsed = !isCollapsed"
          :title="isCollapsed ? 'スレッドを展開' : 'スレッドを折りたたむ'"
          class="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0 select-none hover:ring-1 hover:ring-border transition-all"
        >
          {{ isCollapsed ? '+' : (comment.authorName?.charAt(0).toUpperCase() ?? '?') }}
        </button>
        <span class="font-semibold text-sm truncate">{{ comment.authorName }}</span>
        <span
          v-if="comment.authorId"
          class="text-xs text-muted-foreground font-mono select-all shrink-0"
        >
          ID:{{ comment.authorId }}
        </span>
        <!-- Collapsed preview -->
        <span v-if="isCollapsed" class="text-xs text-muted-foreground truncate italic">
          {{ comment.content?.slice(0, 60) }}{{ (comment.content?.length ?? 0) > 60 ? '…' : '' }}
        </span>
      </div>
      <span class="text-muted-foreground text-xs whitespace-nowrap shrink-0">{{ formatDate(comment.createdAt) }}</span>
    </div>

    <!-- Collapsible body -->
    <template v-if="!isCollapsed">
      <div class="pl-9">
        <div class="relative">
          <p
            ref="contentRef"
            class="text-sm leading-relaxed whitespace-pre-wrap"
            :class="!isContentExpanded ? 'line-clamp-5' : ''"
          >
            {{ comment.content }}
          </p>

          <!-- Gradient fade -->
          <div
            v-if="isLongContent && !isContentExpanded"
            class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none"
          />
        </div>

        <!-- Expand button (centered, overlaps gradient bottom edge) -->
        <div v-if="isLongContent && !isContentExpanded" class="relative z-10 flex justify-center -mt-3">
          <button
            @click="isContentExpanded = true"
            class="flex items-center gap-1.5 text-xs bg-background border border-border/60 rounded-full px-3 py-1 text-foreground/80 hover:text-foreground hover:border-border transition-colors shadow-sm"
          >
            もっと見る
          </button>
        </div>

        <!-- Close button (centered) when expanded -->
        <div v-if="isLongContent && isContentExpanded" class="flex justify-center mt-3">
          <button
            @click="isContentExpanded = false"
            class="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>

      <!-- Reply button (top-level only) -->
      <div v-if="!comment.parentId" class="mt-2 pl-9">
        <button
          @click="showReplyForm = !showReplyForm"
          class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageSquare class="w-3 h-3" />
          返信
        </button>
      </div>

      <!-- Inline reply form -->
      <div v-if="showReplyForm" class="mt-3 pl-9">
        <CommentForm
          :article-id="articleId"
          :parent-id="comment.commentId"
          :api-base="apiBase"
          :api-key="apiKey"
          @success="showReplyForm = false; emit('refresh')"
          @cancel="showReplyForm = false"
        />
      </div>

      <!-- Nested replies -->
      <div
        v-if="comment.replies.length > 0"
        class="mt-2 ml-4 pl-4 border-l-2 border-muted divide-y divide-border/20"
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
        <div v-if="hasManyReplies && !isRepliesExpanded" class="py-3 flex justify-center">
          <button
            @click="isRepliesExpanded = true"
            class="flex items-center gap-1.5 text-xs bg-background border border-border/60 rounded-full px-3 py-1 text-foreground/80 hover:text-foreground hover:border-border transition-colors shadow-sm"
          >
            他{{ hiddenReplyCount }}件の返信を表示
          </button>
        </div>

        <!-- Collapse replies -->
        <div v-if="hasManyReplies && isRepliesExpanded" class="py-3 flex justify-center">
          <button
            @click="isRepliesExpanded = false"
            class="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            返信を折りたたむ
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
