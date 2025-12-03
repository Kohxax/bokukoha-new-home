<script setup lang="ts">
import { CalendarIcon, Archive, NotebookPen, ClockIcon } from "lucide-vue-next";
import Archives from "~/components/partials/Archives.vue";

const route = useRoute()
const currentPage = computed(() => {
  const p = Number(route.params.page)
  return Number.isFinite(p) && p > 0 ? p : 1
})

const pageSize = 4

const { data: posts } = await useAsyncData(
  `blog-page-${currentPage.value}`,
  () =>
    queryCollection("blog")
      .where("draft", "=", "0")
      .select("title", "category", "path", "tags", "description", "date", "coverImage", "rawbody")
      .order("date", "DESC")
      .all()
)

const readingSpeed = 600

const paginatedPosts = computed(() => {
  if (!posts.value) return []
  const start = (currentPage.value - 1) * pageSize
  return posts.value.slice(start, start + pageSize).map(post => {
    const raw = post.rawbody ?? ""
    const charCount = raw.length
    const minutes = Math.max(1, Math.ceil(charCount / readingSpeed))
    return {
      ...post,
      readingTime: minutes
    }
  })
})

const totalPages = computed(() => {
  return posts.value ? Math.ceil(posts.value.length / pageSize) : 1
})

const displayPages = computed(() => {
  const pages = new Set<number>([
    1,
    totalPages.value,
    currentPage.value,
    currentPage.value - 1,
    currentPage.value + 1
  ])

  const sorted = [...pages]
    .filter(p => p >= 1 && p <= totalPages.value)
    .sort((a, b) => a - b)

  const result: (number | string)[] = []
  let prev: number | null = null

  for (const p of sorted) {
    if (prev !== null && p - prev > 1) {
      result.push("…")
    }
    result.push(p)
    prev = p
  }

  return result
})

useSeoMeta({
  title: 'Blog',
  ogDescription: 'ブログ記事一覧',
  twitterTitle: 'Blog',
  twitterDescription: 'ブログ記事一覧',
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 md:py-12 min-h-screen max-w-7xl">

    <div class="grid justify-center grid-cols-[minmax(0,800px)_0px]">

      <div class="max-w-[800px] w-full">

        <div class="flex items-center justify-between mb-5">
          <div class="flex flex-row text-center">
            <NotebookPen class="mt-2 mr-3" />
            <h1 class="text-3xl font-bold">Blog</h1>
          </div>

          <Button variant="outline" class="xl:hidden">
            <NuxtLink to="/blog/archives" class="text-sm flex flex-row gap-x-2">
              <Archive class="h-6 w-6 mt-0.5" />
              <span>アーカイブ</span>
            </NuxtLink>
          </Button>
        </div>

        <div class="space-y-6 md:space-y-12">
          <Card v-for="post in paginatedPosts" :key="post.path" class="overflow-hidden transition-all hover:shadow-lg">
            <NuxtLink :to="post.path">
              <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title"
                class="h-40 md:h-80 w-full object-cover" />
            </NuxtLink>

            <CardHeader>
              <Button variant="secondary" size="sm" as-child class="w-18">
                <NuxtLink :to="`/blog/archives?category=${post.category}`">
                  {{ post.category }}
                </NuxtLink>
              </Button>

              <NuxtLink class="text-2xl mt-3" :to="post.path">
                <CardTitle>{{ post.title }}</CardTitle>
              </NuxtLink>

              <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm mt-2">
                <div class="flex items-center space-x-1">
                  <CalendarIcon class="h-4 w-4" />
                  <span>{{ post.date }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <ClockIcon class="h-4 w-4" />
                  <span>読了時間: {{ post.readingTime }}分</span>
                </div>
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span v-for="tag in (post.tags ?? [])" :key="tag" class="text-base whitespace-nowrap">
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div class="mt-10 text-center gap-2">
          <template v-for="item in displayPages" :key="item">
            <span v-if="item === '…'" class="px-1 text-muted-foreground select-none">
              …
            </span>

            <Button v-else size="lg" :variant="item === currentPage ? 'default' : 'ghost'"
              class="transition-none min-w-8" @click="$router.push(`/blog/page/${item}/`)">
              {{ item }}
            </Button>
          </template>
        </div>
      </div>

      <aside class="hidden xl:block mx-12 w-60 shrink-0 self-start sticky top-42">
        <Archives />
      </aside>

    </div>

    <NotFound v-if="!posts || posts.length === 0" />
  </div>
</template>
