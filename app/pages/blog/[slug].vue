<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

// ヘッダー情報の設定
useHead({
  title: page.value?.title || '記事タイトル', // 記事のタイトルを動的に設定
})
</script>

<template>
  <div class="relative bg-background text-foreground">
    <div v-if="page" class="container mx-auto max-w-5xl px-0 py-0">
      
      <img
        v-if="page.coverImage"
        :src="page.coverImage"
        :alt="page.title"
        class="w-full aspect-video object-cover rounded-none md:rounded-b-lg shadow-md mb-8"
        style="view-transition-name: post-cover-image"
      />

      <article class="prose prose-invert max-w-3xl mx-auto px-4 py-0">
        <span class="inline-block px-3 py-1 text-sm font-semibold bg-primary-foreground text-primary rounded-full mb-4">
          {{ page.category }}
        </span>

        <h1 class="text-4xl font-extrabold leading-tight mt-0 mb-4">{{ page.title }}</h1>

        <div class="flex items-center text-muted-foreground text-sm space-x-4 mb-8">
          <div class="flex items-center space-x-1">
            <CalendarIcon class="h-4 w-4" />
            <span>{{ page.date }}</span>
          </div>
        </div>

        <ContentRenderer :value="page" class="content-body" />
      </article>

      </div>
    <div v-else class="text-center py-16">
      <h1 class="text-3xl font-bold">記事が見つかりません。</h1>
      <p class="text-muted-foreground mt-4">お探しの記事は削除されたか、URLが変更された可能性があります。</p>
      <NuxtLink to="/blog" class="mt-6 inline-block text-primary hover:underline">
        ブログトップに戻る
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
/* ContentRenderer の中身に対する追加スタイル（もし必要なら） */
.content-body h2 {
  font-size: 1.8rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.content-body p {
  line-height: 1.8;
}

/* 他にも必要なスタイルがあればここに追加 */
</style>