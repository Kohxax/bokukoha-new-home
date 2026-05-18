<script setup lang="ts">
import CommentItem, { type Comment } from './CommentItem.vue'

const props = defineProps<{
  articleId: string
}>()

const config = useRuntimeConfig()
const apiBase = config.public.commentApi as string
const apiKey = config.public.commentApiKey as string

const comments = ref<Comment[]>([])
const loading = ref(true)
const fetchError = ref(false)

const safeId = computed(() =>
  props.articleId.replace(/^\/|\/$/g, '').replace(/\//g, '_')
)

const countComments = (list: Comment[]): number =>
  list.reduce((acc, c) => acc + 1 + countComments(c.replies), 0)

const totalCount = computed(() => countComments(comments.value))

const sortOrder = ref<'asc' | 'desc'>('asc')
const sortedComments = computed(() => {
  const list = [...comments.value]
  list.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    const diff = a.createdAt.localeCompare(b.createdAt)
    return sortOrder.value === 'asc' ? diff : -diff
  })
  return list
})

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

// Inline form state
const formExpanded = ref(false)
const newContent = ref('')
const newAuthorName = ref('')
const newAuthorEmail = ref('')
const submitting = ref(false)
const errorMessage = ref('')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const contentTrimmed = computed(() => newContent.value.trim())
const contentTooShort = computed(() => contentTrimmed.value.length > 0 && contentTrimmed.value.length < 2)

const cancelForm = () => {
  newContent.value = ''
  newAuthorName.value = ''
  newAuthorEmail.value = ''
  errorMessage.value = ''
  formExpanded.value = false
}

const submitComment = async () => {
  const emailTrimmed = newAuthorEmail.value.trim()
  if (emailTrimmed && !EMAIL_RE.test(emailTrimmed)) {
    errorMessage.value = 'メールアドレスの形式が正しくありません。'
    return
  }

  submitting.value = true
  errorMessage.value = ''

  try {
    const body: Record<string, string> = { content: newContent.value.trim() }
    if (newAuthorName.value.trim()) body.authorName = newAuthorName.value.trim()
    if (emailTrimmed) body.authorEmail = emailTrimmed

    const res = await fetch(`${apiBase}/comments/${safeId.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (res.status === 201) {
      cancelForm()
      fetchComments()
    } else if (data.type === 'validation') {
      const fieldMessages: Record<string, string> = {
        content: 'コメントの内容が無効です（1〜5000文字）。',
        authorName: '名前が長すぎます（100文字以内）。',
        authorEmail: 'メールアドレスの形式が正しくありません。',
      }
      errorMessage.value = fieldMessages[data.field] ?? '入力内容を確認してください。'
    } else {
      errorMessage.value = '投稿できませんでした。内容を確認してください。'
    }
  } catch {
    errorMessage.value = '送信に失敗しました。しばらく経ってからお試しください。'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section>
    <div class="flex items-baseline justify-between mb-6">
      <h2 class="text-xl font-semibold tracking-tight">
        コメント
        <span v-if="!loading && !fetchError" class="text-muted-foreground text-sm font-normal ml-2">
          {{ totalCount }}件
        </span>
      </h2>
      <div v-if="!loading && !fetchError && comments.length > 1" class="flex text-xs text-muted-foreground">
        <button
          :class="sortOrder === 'asc' ? 'text-foreground font-medium' : 'hover:text-foreground transition-colors'"
          @click="sortOrder = 'asc'"
        >古い順</button>
        <span class="mx-1.5">|</span>
        <button
          :class="sortOrder === 'desc' ? 'text-foreground font-medium' : 'hover:text-foreground transition-colors'"
          @click="sortOrder = 'desc'"
        >新しい順</button>
      </div>
    </div>

    <!-- Inline comment form -->
    <div class="mb-8">
      <!-- Main input (always visible) -->
      <div class="border-b border-border/40 pb-2">
        <textarea
          v-model="newContent"
          maxlength="5000"
          rows="1"
          placeholder="コメントする..."
          class="w-full bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/40 resize-none overflow-hidden"
          @focus="formExpanded = true"
          @input="(e) => { const el = e.target as HTMLTextAreaElement; el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' }"
        />
      </div>

      <!-- Expanded area (name/email + buttons + policy) -->
      <Transition name="form-expand">
        <div v-if="formExpanded" class="overflow-hidden">
          <!-- Name + email -->
          <div class="grid grid-cols-2 gap-3 mt-3">
            <input
              v-model="newAuthorName"
              type="text"
              maxlength="100"
              placeholder="名前（任意）"
              class="bg-transparent border-b border-border/40 pb-1.5 text-sm focus:outline-none focus:border-foreground/40 placeholder:text-muted-foreground/40 transition-colors"
            />
            <input
              v-model="newAuthorEmail"
              type="email"
              maxlength="200"
              placeholder="メール（任意・非公開）"
              class="bg-transparent border-b border-border/40 pb-1.5 text-sm focus:outline-none focus:border-foreground/40 placeholder:text-muted-foreground/40 transition-colors"
            />
          </div>

          <!-- Error -->
          <p v-if="contentTooShort" class="text-amber-400 text-xs mt-2">2文字以上入力してください。</p>
          <p v-else-if="errorMessage" class="text-red-400 text-xs mt-2">{{ errorMessage }}</p>

          <!-- Buttons + policy (same row) -->
          <div class="flex items-center gap-3 mt-3">
            <span class="text-xs text-muted-foreground/50 mr-auto">
              投稿することで<NuxtLink to="/comment-policy" class="underline underline-offset-2 hover:text-muted-foreground/70 transition-colors">コメントポリシー</NuxtLink>に同意したものとみなします。
            </span>
            <button
              type="button"
              class="text-xs text-muted-foreground hover:text-foreground transition-colors"
              @click="cancelForm"
            >
              キャンセル
            </button>
            <Button
              size="sm"
              :disabled="contentTrimmed.length < 2 || submitting"
              @click="submitComment"
            >
              {{ submitting ? '送信中...' : 'コメント' }}
            </Button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="divide-y divide-border/30">
      <div v-for="i in 2" :key="i" class="py-5">
        <div class="h-3 bg-muted/40 animate-pulse rounded w-1/4 mb-3" />
        <div class="h-3 bg-muted/30 animate-pulse rounded w-3/4" />
      </div>
    </div>

    <!-- Error -->
    <p v-else-if="fetchError" class="text-muted-foreground text-sm">
      コメントの読み込みに失敗しました。
    </p>

    <!-- Comment list -->
    <template v-else>
      <p v-if="comments.length === 0" class="text-muted-foreground text-sm">
        まだコメントがありません。最初のコメントを投稿してみましょう！
      </p>
      <div v-else class="divide-y divide-border/30">
        <CommentItem
          v-for="comment in sortedComments"
          :key="comment.commentId"
          :comment="comment"
          :article-id="safeId"
          :api-base="apiBase"
          :api-key="apiKey"
          @refresh="fetchComments"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.form-expand-enter-active,
.form-expand-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.form-expand-enter-from,
.form-expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
