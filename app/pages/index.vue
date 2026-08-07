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
        <div class="relative mb-4">
          <Avatar class="profile-avatar relative h-50 w-50">
            <img src="~/assets/img/icon_glass.webp" alt="Koha" />
            <AvatarFallback>KH</AvatarFallback>
          </Avatar>
        </div>

        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight text-foreground">Koha</h1>
          <p class="text-md text-muted-foreground">@Kohxax / こは</p>
        </div>

        <nav aria-label="トップページの案内" class="mt-6 flex items-center gap-1">
          <NuxtLink
            to="/about"
            class="m3-state-layer inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            <UserRound class="h-4 w-4" />
            <span>こはについて</span>
          </NuxtLink>

          <button
            type="button"
            class="m3-state-layer inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
            @click="scrollToContent"
          >
            <NotebookPenIcon class="h-4 w-4" />
            <span>最近の記事</span>
          </button>
        </nav>

        <div class="mt-6">
          <SocialLinks size="lg" />
        </div>
      </div>
    </main>

    <PageShell id="content" as="section" class="space-y-12 py-12">
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <NotebookPenIcon />
            <h2 class="text-2xl font-bold tracking-tight">Blog</h2>
          </div>
          <Button variant="ghost" size="sm" as-child>
            <NuxtLink to="/blog/page/1/" aria-label="すべて見る">
              すべて見る
              <ArrowRight class="h-4 w-4" />
            </NuxtLink>
          </Button>
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
                <div class="flex items-center justify-between gap-3 pt-4 text-sm text-muted-foreground">
                  <CategoryBadge :category="post.category" />
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
          <div class="flex items-center gap-2">
            <BriefcaseBusinessIcon />
            <h2 class="text-2xl font-bold tracking-tight">Work</h2>
          </div>
          <Button variant="ghost" size="sm" as-child>
            <NuxtLink to="/work/" aria-label="すべて見る">
              すべて見る
              <ArrowRight class="h-4 w-4" />
            </NuxtLink>
          </Button>
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
                <div class="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                  <CategoryBadge :category="work.category" />
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
    </PageShell>
  </div>
</template>
