<script setup lang="ts">
import CommentItem, { type Comment } from './CommentItem.vue'
import CommentForm from './CommentForm.vue'

const props = defineProps<{
  articleId: string
}>()

const config = useRuntimeConfig()
const apiBase = config.public.commentApi as string
const apiKey = config.public.commentApiKey as string

const comments = ref<Comment[]>([])
const loading = ref(true)
const fetchError = ref(false)

// /blog/my-article/ → blog_my-article (スラッシュはAPIパスと競合するため_に変換)
const safeId = computed(() =>
  props.articleId.replace(/^\/|\/$/g, '').replace(/\//g, '_')
)

const fetchComments = async () => {
  loading.value = true
  fetchError.value = false
  try {
    const res = await fetch(`${apiBase}/comments/${safeId.value}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    comments.value = await res.json()
  } catch {
    fetchError.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchComments)
</script>

<template>
  <Card class="rounded-lg border px-5 md:px-10 py-8">
    <h2 class="text-xl font-bold mb-6">
      コメント
      <span v-if="!loading && !fetchError" class="text-muted-foreground text-sm font-normal ml-2">
        {{ comments.length }}件
      </span>
    </h2>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-3 mb-8">
      <div v-for="i in 2" :key="i" class="h-20 bg-muted/30 animate-pulse rounded-lg" />
    </div>

    <!-- Error -->
    <p v-else-if="fetchError" class="text-muted-foreground text-sm mb-8">
      コメントの読み込みに失敗しました。
    </p>

    <!-- Comment list -->
    <template v-else>
      <div v-if="comments.length === 0" class="text-muted-foreground text-sm mb-8">
        まだコメントがありません。最初のコメントを投稿してみましょう！
      </div>
      <div v-else class="space-y-4 mb-10">
        <CommentItem
          v-for="comment in comments"
          :key="comment.commentId"
          :comment="comment"
          :article-id="safeId"
          :api-base="apiBase"
          :api-key="apiKey"
          @refresh="fetchComments"
        />
      </div>

      <div class="border-t border-border/30 pt-6">
        <h3 class="text-base font-semibold mb-4">コメントを投稿</h3>
        <CommentForm
          :article-id="safeId"
          :api-base="apiBase"
          :api-key="apiKey"
          @success="fetchComments"
        />
      </div>
    </template>
  </Card>
</template>
