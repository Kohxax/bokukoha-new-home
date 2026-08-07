<script setup lang="ts">
import { Mail, UserRound } from 'lucide-vue-next'
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
    <div class="mb-5 flex items-center justify-between gap-3">
      <h2 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
        コメント
        <span
          v-if="!loading && !fetchError"
          class="inline-flex min-h-6 items-center rounded-full bg-surface-container-high px-2.5 text-xs font-medium text-muted-foreground"
        >
          {{ totalCount }}件
        </span>
      </h2>
      <div
        v-if="!loading && !fetchError && comments.length > 1"
        class="flex items-center rounded-full bg-surface-container-high p-1"
        role="group"
        aria-label="コメントの並び順"
      >
        <button
          type="button"
          :aria-pressed="sortOrder === 'asc'"
          :class="[
            'm3-state-layer inline-flex min-h-8 items-center rounded-full px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            sortOrder === 'asc'
              ? 'bg-primary-container text-primary-container-foreground'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="sortOrder = 'asc'"
        >古い順</button>
        <button
          type="button"
          :aria-pressed="sortOrder === 'desc'"
          :class="[
            'm3-state-layer inline-flex min-h-8 items-center rounded-full px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            sortOrder === 'desc'
              ? 'bg-primary-container text-primary-container-foreground'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="sortOrder = 'desc'"
        >新しい順</button>
      </div>
    </div>

    <!-- Inline comment form -->
    <div class="mb-8">
      <!-- Main input (always visible) -->
      <div>
        <label for="new-comment-content" class="sr-only">コメント</label>
        <textarea
          id="new-comment-content"
          v-model="newContent"
          maxlength="5000"
          rows="1"
          placeholder="コメントする..."
          class="min-h-12 w-full resize-none overflow-hidden rounded-2xl border border-border/60 bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          @focus="formExpanded = true"
          @input="(e) => { const el = e.target as HTMLTextAreaElement; el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' }"
        />
      </div>

      <!-- Expanded area (name/email + buttons + policy) -->
      <Transition name="form-expand">
        <div v-if="formExpanded" class="mt-4 overflow-hidden border-t border-border/40 pt-4">
          <!-- Name + email -->
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label for="new-comment-author-name" class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <UserRound class="size-3.5" aria-hidden="true" />
                名前（任意）
              </label>
              <input
                id="new-comment-author-name"
                v-model="newAuthorName"
                type="text"
                maxlength="100"
                placeholder="名無しさん"
                autocomplete="name"
                class="min-h-11 w-full rounded-xl border border-border/70 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div class="space-y-1.5">
              <label for="new-comment-author-email" class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Mail class="size-3.5" aria-hidden="true" />
                メール（任意・非公開）
              </label>
              <input
                id="new-comment-author-email"
                v-model="newAuthorEmail"
                type="email"
                maxlength="200"
                placeholder="example@email.com"
                autocomplete="email"
                class="min-h-11 w-full rounded-xl border border-border/70 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <!-- Error -->
          <p
            v-if="contentTooShort"
            class="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-300"
          >2文字以上入力してください。</p>
          <p
            v-else-if="errorMessage"
            class="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-red-300"
          >{{ errorMessage }}</p>

          <!-- Buttons + policy (same row) -->
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <span class="order-last basis-full text-xs leading-relaxed text-muted-foreground/70 sm:order-none sm:mr-auto sm:basis-auto">
              投稿することで<NuxtLink to="/comment-policy" class="underline underline-offset-2 hover:text-muted-foreground/70 transition-colors">コメントポリシー</NuxtLink>に同意したものとみなします。
            </span>
            <button
              type="button"
              class="m3-state-layer min-h-10 rounded-full px-4 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              @click="cancelForm"
            >
              キャンセル
            </button>
            <Button
              type="button"
              size="sm"
              class="min-h-10 px-5"
              :disabled="contentTrimmed.length < 2 || submitting"
              @click="submitComment"
            >
              {{ submitting ? '送信中...' : '投稿' }}
            </Button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 2" :key="i" class="rounded-2xl bg-surface-container-low p-4 sm:p-5">
        <div class="mb-3 h-3 w-1/4 animate-pulse rounded-full bg-muted/40" />
        <div class="h-3 w-3/4 animate-pulse rounded-full bg-muted/30" />
      </div>
    </div>

    <!-- Error -->
    <p v-else-if="fetchError" class="text-muted-foreground text-sm">
      コメントの読み込みに失敗しました。
    </p>

    <!-- Comment list -->
    <template v-else>
      <p v-if="comments.length === 0" class="rounded-2xl bg-surface-container-low px-4 py-5 text-sm text-muted-foreground">
        まだコメントがありません。最初のコメントを投稿してみましょう！
      </p>
      <div v-else class="space-y-3">
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
