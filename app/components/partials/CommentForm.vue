<script setup lang="ts">
const props = defineProps<{
  articleId: string
  parentId?: string
  apiBase: string
  apiKey: string
}>()

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
  <form @submit.prevent="submit" class="space-y-3">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label class="text-xs text-muted-foreground mb-1 block">名前（任意）</label>
        <input
          v-model="authorName"
          type="text"
          maxlength="100"
          placeholder="名無しさん"
          class="w-full bg-muted/30 border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30 placeholder:text-muted-foreground/50 transition-colors"
        />
      </div>
      <div>
        <label class="text-xs text-muted-foreground mb-1 block">メール（任意・非公開）</label>
        <input
          v-model="authorEmail"
          type="email"
          maxlength="200"
          placeholder="example@email.com"
          class="w-full bg-muted/30 border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30 placeholder:text-muted-foreground/50 transition-colors"
        />
      </div>
    </div>

    <div>
      <label class="text-xs text-muted-foreground mb-1 block">
        コメント <span class="text-red-400">*</span>
      </label>
      <textarea
        v-model="content"
        rows="4"
        maxlength="5000"
        required
        placeholder="コメントを入力..."
        class="w-full bg-muted/30 border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30 placeholder:text-muted-foreground/50 resize-y transition-colors"
      />
      <div class="text-right text-xs text-muted-foreground mt-1">
        {{ content.length }} / 5000
      </div>
    </div>

    <p v-if="contentTooShort" class="text-amber-400 text-sm">2文字以上入力してください。</p>
    <p v-else-if="errorMessage" class="text-red-400 text-sm">{{ errorMessage }}</p>

    <div class="flex items-center gap-2">
      <Button
        type="submit"
        size="sm"
        :disabled="submitting || contentTrimmed.length < 2"
      >
        {{ submitting ? '送信中...' : parentId ? '返信する' : '投稿する' }}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        @click="emit('cancel')"
      >
        キャンセル
      </Button>
    </div>
    <p class="text-xs text-muted-foreground/60">
      投稿することで<NuxtLink to="/comment-policy" class="underline underline-offset-2 hover:text-muted-foreground transition-colors">コメントポリシー</NuxtLink>に同意したものとみなします。
    </p>
  </form>
</template>
