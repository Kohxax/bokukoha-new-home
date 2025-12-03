<script setup lang="ts">
import { CalendarIcon, ClockIcon } from 'lucide-vue-next'
import RelatedPost from '~/components/partials/RelatedPost.vue'
import SocialShare from '~/components/partials/SocialShare.vue'
import LikeButton from '~/components/partials/LikeButton.vue'
import { defineArticle, useSchemaOrg } from '#imports'

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

const raw = page.value?.rawbody ?? ''
const charsPerMin = 800

const readingMin = Math.max(1, Math.ceil(raw.length / charsPerMin))

useSchemaOrg([
  defineArticle({
    datePublised: page.value?.date,
    image: page.value?.coverImage,
  }),
])

useSeoMeta({
  title: page.value?.title,
  ogImage: page.value?.coverImage,
  ogDescription: page.value?.description,
  twitterTitle: page.value?.title,
  twitterImage: page.value?.coverImage,
})

useHead({
  title: page.value?.title,
})

const { $imageViewer } = useNuxtApp()
const { open, register, unregister } = $imageViewer

onMounted(() => {
  if (page.value?.coverImage) {
    register(page.value.coverImage, page.value.title)
  }
})

onUnmounted(() => {
  if (page.value?.coverImage) {
    unregister(page.value.coverImage)
  }
})
</script>

<template>
  <div class="container mx-auto max-w-230 px-4 py-8 md:py-12">
    <div v-if="page">
      <Card class="overflow-hidden rounded-lg shadow-xl border">
        <div v-if="page.coverImage" class="relative">
          <img
            :src="page.coverImage"
            :alt="page.title"
            class="w-full aspect-video object-cover rounded-t-lg cursor-pointer hover:opacity-95 transition-opacity"
            @click="open(page.coverImage)"
          />
        </div>

        <CardHeader class="pt-2 px-5 md:px-10">
          <Button variant="secondary" class="mb-2 w-18">
            <NuxtLink :to="`/blog/archives?category=${page.category}`">
              {{ page.category }}
            </NuxtLink>
          </Button>
          <CardTitle class="text-3xl md:text-4xl font-extrabold leading-tight mt-0">
            {{ page.title }}
          </CardTitle>
          <div
            class="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm mt-2"
          >
            <div class="flex items-center space-x-1">
              <CalendarIcon class="h-4 w-4" />
              <span>{{ page.date }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <ClockIcon class="h-4 w-4" />
              <span>読了時間: {{ readingMin }}分</span>
            </div>
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span v-for="tag in page.tags ?? []" :key="tag" class="text-base whitespace-nowrap">
                #{{ tag }}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent class="prose prose-invert max-w-none px-5 md:px-10 pb-4">
          <ContentRenderer :value="page" />
        </CardContent>

        <div class="flex flex-col items-center justify-center my-3">
          <LikeButton class="pl-5" :article-id="page.path" />
          <SocialShare class="mt-3" :showRSS="true" />
        </div>
      </Card>

      <RelatedPost :category="page.category" :current-path="page.path" />
    </div>

    <NotFound v-else />
  </div>
</template>

<style scoped>
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  margin-left: -1.2rem;
  border-left: 4px solid var(--color-foreground);
  padding-left: 1rem;
}

@media (min-width: 768px) {
  .prose :deep(h1),
  .prose :deep(h2),
  .prose :deep(h3),
  .prose :deep(h4),
  .prose :deep(h5),
  .prose :deep(h6) {
    margin-left: -2.5rem;
    padding-left: 2rem;
  }
}

.prose :deep(h1) {
  font-size: 2rem;
  display: flow-root;
  margin-top: 2rem !important;
}

.prose :deep(h2) {
  font-size: 1.7rem;
  margin-top: 0;
}

.prose :deep(h3) {
  font-size: 1.4rem;
  margin-top: 0;
}

.prose :deep(h4) {
  font-size: 1.1rem;
  margin-top: 1rem;
}

.prose :deep(p) {
  font-size: 1.15rem;
}
</style>
