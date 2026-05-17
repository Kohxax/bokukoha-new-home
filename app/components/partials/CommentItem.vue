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

const showReplyForm = ref(false)

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
        <div
          class="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0 select-none"
        >
          {{ comment.authorName?.charAt(0).toUpperCase() ?? '?' }}
        </div>
        <span class="font-semibold text-sm truncate">{{ comment.authorName }}</span>
        <span
          v-if="comment.authorId"
          class="text-xs text-muted-foreground font-mono select-all shrink-0"
        >
          ID:{{ comment.authorId }}
        </span>
      </div>
      <span class="text-muted-foreground text-xs whitespace-nowrap shrink-0">{{ formatDate(comment.createdAt) }}</span>
    </div>

    <p class="text-sm leading-relaxed whitespace-pre-wrap pl-9">{{ comment.content }}</p>

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
</template>
