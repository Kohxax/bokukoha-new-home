<script setup lang="ts">
import { X } from 'lucide-vue-next'
import CommentForm from './CommentForm.vue'

const props = defineProps<{
  articleId: string
  apiBase: string
  apiKey: string
}>()

const emit = defineEmits<{
  success: []
  close: []
}>()

const onSuccess = () => {
  emit('success')
  emit('close')
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      aria-hidden="true"
      @click="emit('close')"
    />

    <!-- Panel: bottom sheet on mobile, centered modal on sm+ -->
    <div
      role="dialog"
      aria-modal="true"
      aria-label="コメントを投稿"
      class="fixed z-50 bg-background border border-border/50 shadow-xl rounded-2xl
             left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
             w-[calc(100%-1rem)] max-w-lg"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/30">
<h3 class="font-semibold text-sm">コメントを投稿</h3>
        <button
          @click="emit('close')"
          class="ml-auto -mr-1 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="閉じる"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Form -->
      <div class="px-5 py-4">
        <CommentForm
          :article-id="articleId"
          :api-base="apiBase"
          :api-key="apiKey"
          @success="onSuccess"
          @cancel="emit('close')"
        />
      </div>
    </div>
  </Teleport>
</template>
