<script setup lang="ts">
import { Rocket, BriefcaseBusiness } from 'lucide-vue-next'

const route = useRoute()
const { data: posts } = await useAsyncData('work-list', () => {
  return queryCollection('work')
    .where('draft', '=', '0') // draft = 0 (false)は載せるようにする, bool読めないのバカすぎ
    .select('title', 'category', 'path', 'description', 'date', 'coverImage', 'tags')
    .order('date', 'DESC')
    .all()
})

watch(
  () => route.query.page,
  () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
)

useSeoMeta({
  title: 'Work',
  ogDescription: '制作物一覧',
  twitterTitle: 'Work',
  twitterDescription: '制作物一覧',
})

useHead({
  title: 'Work',
})
</script>

<template>
  <PageShell variant="list" class="min-h-screen py-8 md:py-12">
    <div class="mx-auto max-w-[800px] gap-6">
      <div class="flex flex-row text-center mb-5">
        <BriefcaseBusiness class="mt-2 mr-3" />
        <h1 class="text-3xl font-bold tracking-tight">Work</h1>
      </div>
      <div class="space-y-6 md:space-y-12">
        <Card
          v-for="post in posts"
          :key="post.path"
          variant="elevated"
          class="m3-interactive-card overflow-hidden"
        >
          <NuxtLink :to="post.path">
            <CoverImg
              v-if="post.coverImage"
              :src="post.coverImage"
              :alt="post.title"
              class="h-40 md:h-80 w-full object-cover"
            />
          </NuxtLink>

          <CardHeader>
            <CategoryBadge :category="post.category" class="px-4" />
            <NuxtLink class="mt-3 text-2xl" :to="post.path">
              <CardTitle>{{ post.title }}</CardTitle>
            </NuxtLink>
            <div
              class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
            >
              <div class="flex items-center space-x-1">
                <Rocket class="h-4 w-4" />
                <span>{{ post.date }}</span>
              </div>
              <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span v-for="tag in post.tags ?? []" :key="tag" class="text-base whitespace-nowrap">
                  #{{ tag }}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>

    <NotFound v-if="!posts || posts.length === 0" />
  </PageShell>
</template>
