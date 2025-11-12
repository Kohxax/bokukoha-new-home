<script setup lang="ts">
import { CalendarIcon, ClockIcon } from 'lucide-vue-next'
import RelatedPost from '~/components/partials/RelatedPost.vue'

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

useHead({
  title: page.value?.title || '記事タイトル',
})

const tocLinks = computed(() => page.value?.body?.toc?.links || [])
</script>

<template>
  <div class="container mx-auto max-w-5xl px-4 py-8 md:py-12">
    <div v-if="page">
      <Card class="overflow-hidden rounded-lg shadow-xl border">

        <div v-if="page.coverImage" class="relative">
          <img :src="page.coverImage" :alt="page.title" class="w-full aspect-video object-cover rounded-t-lg"
            style="view-transition-name: post-cover-image" />
        </div>

        <CardHeader class="pt-2 px-10">
          <Button variant="secondary" class="mb-2 w-18">
            <NuxtLink :to="`/blog/archives?category=${page.category}`">
              {{ page.category }}
            </NuxtLink>
          </Button>
          <CardTitle class="text-3xl md:text-4xl font-extrabold leading-tight mt-0">
            {{ page.title }}
          </CardTitle>
          <div class="flex items-center text-muted-foreground text-sm space-x-4 mt-2">
            <div class="flex items-center space-x-1">
              <CalendarIcon class="h-4 w-4" />
              <span>{{ page.date }}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent class="prose prose-invert max-w-none px-10 py-4">
          <ContentRenderer :value="page" />
        </CardContent>

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
  margin-left: -2.5rem;
  border-left: 4px solid var(--color-foreground);
  padding-left: 2rem;
}

.prose :deep(h2) {
  font-size: 1.8rem;
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
</style>
