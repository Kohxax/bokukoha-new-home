<script setup lang="ts">
import { Mail, MessageSquare, UserRound } from 'lucide-vue-next'

const props = defineProps<{
  articleId: string
  parentId?: string
  apiBase: string
  apiKey: string
}>()

const fieldId = (field: string) => `comment-${props.parentId ?? 'new'}-${field}`

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const authorName = ref('')
const authorEmail = ref('')
const content = ref('')
const submitting = ref(false)
const errorMessage = ref('')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const contentTrimmed = computed(() => content.value.trim())
const contentTooShort = computed(() => contentTrimmed.value.length > 0 && contentTrimmed.value.length < 2)

const submit = async () => {
  submitting.value = true
  errorMessage.value = ''

  const emailTrimmed = authorEmail.value.trim()
  if (emailTrimmed && !EMAIL_RE.test(emailTrimmed)) {
    errorMessage.value = 'メールアドレスの形式が正しくありません。'
    submitting.value = false
    return
  }

  try {
    const body: Record<string, string> = {
      content: content.value.trim(),
    }
    if (authorName.value.trim()) body.authorName = authorName.value.trim()
    if (emailTrimmed) body.authorEmail = emailTrimmed
    if (props.parentId) body.parentId = props.parentId

    const res = await fetch(
      `${props.apiBase}/comments/${props.articleId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': props.apiKey,
        },
        body: JSON.stringify(body),
      }
    )

    const data = await res.json()

    if (res.status === 201) {
      authorName.value = ''
      authorEmail.value = ''
      content.value = ''
      emit('success')
    } else if (data.type === 'validation') {
      const fieldMessages: Record<string, string> = {
        content: 'コメントの内容が無効です（1〜5000文字）。',
        authorName: '名前が長すぎます（100文字以内）。',
        authorEmail: 'メールアドレスの形式が正しくありません。',
        parentId: '返信先のコメントが見つかりません。',
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
  <form @submit.prevent="submit" class="space-y-4">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label :for="fieldId('author-name')" class="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <UserRound class="size-3.5" aria-hidden="true" />
          名前（任意）
        </label>
        <input
          :id="fieldId('author-name')"
          v-model="authorName"
          type="text"
          maxlength="100"
          placeholder="名無しさん"
          autocomplete="name"
          class="min-h-11 w-full rounded-xl border border-border/70 bg-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div>
        <label :for="fieldId('author-email')" class="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Mail class="size-3.5" aria-hidden="true" />
          メール（任意・非公開）
        </label>
        <input
          :id="fieldId('author-email')"
          v-model="authorEmail"
          type="email"
          maxlength="200"
          placeholder="example@email.com"
          autocomplete="email"
          class="min-h-11 w-full rounded-xl border border-border/70 bg-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>

    <div>
      <label :for="fieldId('content')" class="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <MessageSquare class="size-3.5" aria-hidden="true" />
        コメント <span class="text-red-400">*</span>
      </label>
      <textarea
        :id="fieldId('content')"
        v-model="content"
        rows="4"
        maxlength="5000"
        required
        placeholder="コメントを入力..."
        class="min-h-28 w-full resize-y rounded-2xl border border-border/70 bg-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <div class="mt-1.5 text-right text-xs text-muted-foreground">
        {{ content.length }} / 5000
      </div>
    </div>

    <p
      v-if="contentTooShort"
      class="rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-300"
    >2文字以上入力してください。</p>
    <p
      v-else-if="errorMessage"
      class="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-300"
    >{{ errorMessage }}</p>

    <div class="flex flex-wrap items-center gap-2">
      <Button
        type="submit"
        size="sm"
        class="min-h-10 px-5"
        :disabled="submitting || contentTrimmed.length < 2"
      >
        {{ submitting ? '送信中...' : parentId ? '返信する' : '投稿' }}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        class="min-h-10 px-4"
        @click="emit('cancel')"
      >
        キャンセル
      </Button>
    </div>
    <p class="rounded-xl bg-surface-container-low px-3 py-2 text-xs leading-relaxed text-muted-foreground/75">
      投稿することで<NuxtLink to="/comment-policy" class="underline underline-offset-2 hover:text-muted-foreground transition-colors">コメントポリシー</NuxtLink>に同意したものとみなします。
    </p>
  </form>
</template>
