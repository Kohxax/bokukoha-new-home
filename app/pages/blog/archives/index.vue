<script setup>
import { CalendarDays, Hash, Archive } from 'lucide-vue-next'
import Likes from '~/components/partials/Likes.vue'

const route = useRoute()
const year = computed(() => route.query.year)
const category = computed(() => route.query.category)

const { data: posts } = await useAsyncData(
  `archives-${year.value || category.value || 'all'}`,
  () =>
    queryCollection('blog')
      .select('title', 'path', 'category', 'date', 'coverImage', 'description')
      .where('draft', '=', '0')
      .order('date', 'DESC')
      .all(),
)

const categories = computed(() => {
  const map = {}
  posts.value?.forEach((p) => {
    if (!map[p.category]) map[p.category] = 0
    map[p.category]++
  })
  return Object.entries(map).map(([category, count]) => ({ category, count }))
})

const years = computed(() => {
  const map = {}
  posts.value?.forEach((p) => {
    const y = new Date(p.date).getFullYear()
    if (!map[y]) map[y] = 0
    map[y]++
  })
  return Object.entries(map)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, count]) => ({ year, count }))
})

const filteredPosts = computed(() => {
  if (!posts.value) return []
  if (year.value) {
    return posts.value.filter((p) => new Date(p.date).getFullYear() === Number(year.value))
  }
  if (category.value) {
    return posts.value.filter((p) => p.category === category.value)
  }
  return posts.value
})

useSeoMeta({
  title: 'Archives',
  ogDescription: 'ブログ記事アーカイブ',
  twitterTitle: 'Archives',
  twitterDescription: 'ブログ記事アーカイブ',
})
</script>

<template>
  <div class="container mx-auto max-w-5xl px-4 py-8 md:py-12 min-h-screen">
    <template v-if="!year && !category">
      <div class="mb-8 flex flex-row text-center gap-3">
        <Archive class="w-6 h-6 mt-2" />
        <h1 class="text-3xl font-bold tracking-tight">アーカイブ</h1>
      </div>
      <section class="mb-12">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <Hash class="h-5 w-5" /> カテゴリ
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.category"
            :to="`/blog/archives?category=${cat.category}`"
            class="m3-interactive-card rounded-3xl bg-surface-container p-6 text-center"
          >
            <div class="text-lg font-medium">{{ cat.category }}</div>
            <div class="text-sm text-muted-foreground">{{ cat.count }} 記事</div>
          </NuxtLink>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <CalendarDays class="h-5 w-5" /> 年別アーカイブ
        </h2>
        <div class="flex flex-col gap-4">
          <NuxtLink
            v-for="y in years"
            :key="y.year"
            :to="`/blog/archives?year=${y.year}`"
            class="m3-interactive-card flex items-center justify-between rounded-2xl bg-surface-container p-5"
          >
            <span class="text-lg font-medium">{{ y.year }}</span>
            <span class="text-muted-foreground">{{ y.count }} 記事</span>
          </NuxtLink>
        </div>
      </section>
    </template>

    <template v-else>
      <div style="view-transition-name: blog-content">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold tracking-tight">
            {{ year ? `${year}` : category ? `${category}` : 'アーカイブ' }}
          </h1>

          <Button v-if="year || category" variant="outline" as-child>
            <NuxtLink to="/blog/archives" class="text-sm flex flex-row gap-x-2 items-center">
              <Archive class="h-5 w-5" />
              <span>アーカイブ一覧に戻る</span>
            </NuxtLink>
          </Button>
        </div>

        <div v-if="filteredPosts.length" class="space-y-3">
          <Card
            v-for="post in filteredPosts"
            :key="post.path"
            variant="filled"
            class="m3-interactive-card overflow-hidden"
          >
            <NuxtLink :to="post.path" class="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
              <div class="min-w-0 flex-1">
                <CardTitle class="line-clamp-2 text-base font-semibold leading-snug sm:text-lg">
                  {{ post.title }}
                </CardTitle>
                <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                  <CategoryBadge :category="post.category" />
                  <Likes :article-id="post.path" />
                  <span class="inline-flex items-center gap-1 whitespace-nowrap">
                    <CalendarDays class="h-4 w-4" />
                    {{ post.date }}
                  </span>
                </div>
              </div>
              <CoverImg
                v-if="post.coverImage"
                :src="post.coverImage"
                alt=""
                class="size-20 shrink-0 rounded-xl object-cover sm:size-24 sm:rounded-2xl"
              />
            </NuxtLink>
          </Card>
        </div>

        <p v-else class="text-muted-foreground">該当する投稿はありません。</p>
      </div>
    </template>
  </div>
</template>
