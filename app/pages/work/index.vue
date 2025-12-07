<script setup lang="ts">
import { Rocket, BriefcaseBusiness } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { watch } from 'vue'

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
  <div class="container mx-auto max-w-5xl px-4 py-8 md:py-12 min-h-screen">
    <div class="mx-auto max-w-4xl gap-6">
      <div class="flex flex-row text-center mb-5">
        <BriefcaseBusiness class="mt-2 mr-3" />
        <h1 class="text-3xl font-bold tracking-tight">Work</h1>
      </div>
      <div class="space-y-12">
        <Card
          v-for="post in posts"
          :key="post.path"
          class="overflow-hidden transition-all hover:shadow-lg"
        >
          <NuxtLink :to="post.path">
            <NuxtImg
              v-if="post.coverImage"
              :src="post.coverImage"
              :alt="post.title"
              format="webp"
              class="h-40 md:h-80 w-full object-cover"
            />
          </NuxtLink>

          <CardHeader>
            <span
              class="inline-block px-2 py-2 text-sm font-semibold bg-muted text-center rounded-lg w-25"
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
