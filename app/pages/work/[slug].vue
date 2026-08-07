<script setup lang="ts">
import { Rocket } from 'lucide-vue-next'
import Toc from '~/components/partials/Toc.vue'
import { defineArticle, useSchemaOrg } from '#imports'
import ArticleActions from '~/components/partials/ArticleActions.vue'
import CommentSection from '~/components/partials/CommentSection.vue'

useTwemoji()

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('work').path(route.path).first()
})

const resolvedCoverImage = computed(() => resolveCoverImage(page.value?.coverImage))

useSchemaOrg([
  defineArticle({
    datePublised: page.value?.date,
    image: resolvedCoverImage.value,
  }),
])

useSeoMeta({
  title: page.value?.title,
  ogImage: resolvedCoverImage.value,
  ogDescription: page.value?.description,
  twitterTitle: page.value?.title,
  twitterDescription: page.value?.description,
  twitterImage: resolvedCoverImage.value,
})

useHead({
  title: page.value?.title,
})

const { $imageViewer } = useNuxtApp()
const { open, register, unregister } = $imageViewer

onMounted(() => {
  if (resolvedCoverImage.value) {
    register(resolvedCoverImage.value, page.value?.title ?? '')
  }
})

onUnmounted(() => {
  if (resolvedCoverImage.value) {
    unregister(resolvedCoverImage.value)
  }
})
</script>

<template>
  <PageShell variant="article" class="flex flex-col py-8 md:py-12">
    <template v-if="page">
      <div
        class="grid w-full grid-cols-1 gap-4 xl:grid-cols-[1fr_minmax(auto,896px)_1fr] xl:gap-10"
      >
        <!-- Left Side: Empty for centering -->
        <div class="hidden xl:block"></div>

        <!-- Center: Main Article Content -->
        <div class="min-w-0">
          <Card variant="filled" class="overflow-hidden border-0 shadow-none">
            <div v-if="resolvedCoverImage" class="relative">
              <CoverImg
                :src="page.coverImage"
                :alt="page.title"
                class="w-full aspect-video object-cover rounded-t-3xl cursor-pointer transition-opacity hover:opacity-95"
                style="view-transition-name: post-cover-image"
                @click="open(resolvedCoverImage)"
              />
            </div>

            <CardHeader class="pt-2 px-5 md:px-10">
              <CategoryBadge :category="page.category" />
              <CardTitle class="text-3xl md:text-4xl font-extrabold leading-tight mt-0">
                {{ page.title }}
              </CardTitle>
              <div class="flex items-center text-muted-foreground text-sm space-x-4 mt-2">
                <div class="flex items-center space-x-1">
                  <Rocket class="h-4 w-4" />
                  <span>{{ page.date }}</span>
                </div>
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    v-for="tag in page.tags ?? []"
                    :key="tag"
                    class="text-base whitespace-nowrap"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </CardHeader>

            <div class="px-5 md:px-10 mb-6" v-if="page.body?.toc">
              <Toc :toc="page.body?.toc" is-inline />
            </div>

            <CardContent class="prose article-prose max-w-none px-5 md:px-10 pb-4">
              <ContentRenderer :value="page" />
            </CardContent>

            <div class="flex items-center justify-center my-8">
              <ArticleActions :article-id="page.path" />
            </div>
          </Card>
        </div>

        <!-- Right Side: Like and SocialShare buttons -->
        <aside class="hidden xl:flex flex-col items-start sticky top-32 h-[calc(100vh-8rem)]">
          <div class="flex flex-col items-center">
            <ArticleActions :article-id="page.path" is-vertical />
          </div>
        </aside>
      </div>

      <div id="comments" class="max-w-4xl mx-auto w-full mt-18">
        <CommentSection :article-id="page.path" />
      </div>
    </template>
    <NotFound v-else />
  </PageShell>
</template>
