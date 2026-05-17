<script setup lang="ts">
import CommentItem, { type Comment } from './CommentItem.vue'
import CommentDialog from './CommentDialog.vue'

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

const countComments = (list: Comment[]): number =>
  list.reduce((acc, c) => acc + 1 + countComments(c.replies), 0)

const totalCount = computed(() => countComments(comments.value))

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

const dialogOpen = ref(false)
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold tracking-tight">
        コメント
        <span v-if="!loading && !fetchError" class="text-muted-foreground text-sm font-normal ml-2">
          {{ totalCount }}件
        </span>
      </h2>
      <Button size="sm" @click="dialogOpen = true">
        + コメントを書く
      </Button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="divide-y divide-border/30 mb-8">
      <div v-for="i in 2" :key="i" class="py-5">
        <div class="h-3 bg-muted/40 animate-pulse rounded w-1/4 mb-3" />
        <div class="h-3 bg-muted/30 animate-pulse rounded w-3/4" />
      </div>
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
      <div v-else class="divide-y divide-border/30 mb-8">
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
    </template>

    <!-- Comment dialog -->
    <CommentDialog
      v-if="dialogOpen"
      :article-id="safeId"
      :api-base="apiBase"
      :api-key="apiKey"
      @success="fetchComments"
      @close="dialogOpen = false"
    />
  </section>
</template>

<style scoped>
.section-heading {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}
</style>
