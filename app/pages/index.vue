<script lang="ts" setup>
import {
  ArrowRight,
  NotebookPenIcon,
  BriefcaseBusinessIcon,
  UserRound,
} from 'lucide-vue-next'
import Avatar from '~/components/ui/avatar/Avatar.vue'
import SocialLinks from '~/components/partials/SocialLinks.vue'

const { data: blogPosts } = await useAsyncData('blog-list', () => {
  return queryCollection('blog')
    .where('draft', '=', '0')
    .select('title', 'category', 'path', 'description', 'date', 'coverImage')
    .order('date', 'DESC')
    .limit(3)
    .all()
})

const { data: works } = await useAsyncData('work-list', () => {
  return queryCollection('work')
    .where('draft', '=', '0')
    .select('title', 'category', 'path', 'description', 'date', 'coverImage', 'tags')
    .order('date', 'DESC')
    .limit(2)
    .all()
})

const scrollToContent = () => {
  const contentSection = document.getElementById('content')
  if (contentSection) {
    contentSection.scrollIntoView({ behavior: 'smooth' })
  }
}

useSeoMeta({
  ogDescription:
    'ぼくこは.devはこはのプロフィールやブログ記事、ポートフォリオをまとめた個人サイトです。',
  twitterTitle: 'Home',
  twitterDescription:
    'ぼくこは.devはこはのプロフィールやブログ記事、ポートフォリオをまとめた個人サイトです。',
})
</script>

<template>
  <div class="relative">
    <main
      class="relative flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-4 text-center"
    >
      <div class="flex flex-col items-center justify-center">
        <div class="relative mb-3">
          <Avatar class="relative h-50 w-50 shadow-xl" style="view-transition-name: main-avatar">
            <img src="~/assets/img/icon_glass.webp" alt="Koha" />
            <AvatarFallback>KH</AvatarFallback>
          </Avatar>
        </div>

        <h1 class="text-3xl font-bold tracking-tight text-foreground">Koha</h1>
        <p class="text-md text-muted-foreground">@Kohxax / こは</p>

        <div class="flex flex-row items-center gap-3 mt-5">
          <Button variant="outline" as-child>
            <NuxtLink to="/about">
              <UserRound class="h-4 w-4" />
              こはについて
            </NuxtLink>
          </Button>

          <Button
            variant="outline"
            @click="scrollToContent"
          >
            <NotebookPenIcon class="h-4 w-4" />
            最近の記事
          </Button>
        </div>

        <div class="mt-5">
          <SocialLinks size="lg" />
        </div>
      </div>
    </main>

    <section id="content" class="container mx-auto max-w-5xl px-6 py-12 space-y-12">
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <NotebookPenIcon />
            <h2 class="ml-2 text-2xl font-bold tracking-tight">Blog</h2>
          </div>
          <NuxtLink
            to="/blog/page/1/"
            class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            alt="すべて見る"
          >
            すべて見る
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card
            v-for="post in blogPosts"
            :key="post.path"
            variant="filled"
            class="m3-interactive-card overflow-hidden"
          >
            <NuxtLink :to="post.path">
              <CoverImg
                :src="post.coverImage"
                :alt="post.title"
                class="aspect-video w-full object-cover"
              />
              <CardHeader>
                <div class="flex items-center justify-between text-sm pt-4 text-muted-foreground">
                  <span>{{ post.category }}</span>
                  <span>{{ post.date }}</span>
                </div>
                <CardTitle class="pt-1 text-lg line-clamp-2">{{ post.title }}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription class="line-clamp-2 pt-3">{{ post.description }}</CardDescription>
              </CardContent>
            </NuxtLink>
          </Card>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex text-center">
            <BriefcaseBusinessIcon class="mt-1.5" />
            <h2 class="ml-2 text-2xl font-bold tracking-tight">Work</h2>
          </div>
          <NuxtLink
            to="/work/"
            class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            alt="すべて見る"
          >
            すべて見る
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card
            v-for="work in works"
            :key="work.path"
            variant="filled"
            class="m3-interactive-card overflow-hidden"
          >
            <NuxtLink :to="work.path">
              <CoverImg
                :src="work.coverImage"
                :alt="work.title"
                class="aspect-video h-55 w-full object-cover"
              />
              <CardHeader>
                <CardTitle class="text-lg pt-3">{{ work.title }}</CardTitle>
                <div class="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{{ work.category }}</span>
                  <div class="flex flex-wrap items-center gap-x-2">
                    <span v-for="tag in work.tags ?? []" :key="tag" class="line-clamp-1">
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </NuxtLink>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>
