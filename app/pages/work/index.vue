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
  <div class="container mx-auto max-w-5xl px-3 py-8 md:py-12 min-h-screen">
    <div class="mx-auto max-w-4xl gap-6">
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
            <span
              class="inline-flex h-8 items-center justify-self-start rounded-full bg-primary-container px-4 text-sm font-medium text-primary-container-foreground"
            >
              {{ post.category }}
            </span>
            <NuxtLink class="text-2xl mt-4" :to="post.path">
              <CardTitle>{{ post.title }}</CardTitle>
            </NuxtLink>
            <div class="flex flex-row items-center gap-x-4 gap-y-2 mt-4 text-muted-foreground">
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
  </div>
</template>
