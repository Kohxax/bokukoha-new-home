<script setup lang="ts">
import { Rss } from 'lucide-vue-next'
import SocialLinks from '~/components/partials/SocialLinks.vue'

const navLinks = [
  { label: 'Blog', to: '/blog/page/1/' },
  { label: 'Work', to: '/work/' },
  { label: 'About', to: '/about/' },
  { label: 'Archives', to: '/blog/archives' },
]

const launchYear = 2025
const currentYear = new Date().getFullYear()

const brandYear = computed(() => {
  return launchYear === currentYear ? `${launchYear}` : `${launchYear}-${currentYear}`
})
</script>

<template>
  <footer class="mt-12 w-full border-t border-border/60 bg-surface-container-low">
    <div class="container mx-auto max-w-5xl px-6 py-10">
      <div class="mb-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
        <!-- Brand -->
        <div class="col-span-2 flex flex-col gap-2 sm:col-span-1">
          <NuxtLink
            to="/"
            class="m3-state-layer -ml-2 w-fit rounded-full px-2 py-1 text-base font-bold text-foreground transition-colors"
          >
            ぼくこは.dev
          </NuxtLink>
          <p class="max-w-sm text-xs leading-relaxed text-muted-foreground">
            ぼくこは.devはこはのプロフィールやブログ記事、ポートフォリオをまとめた個人サイトです。
          </p>
        </div>

        <!-- Nav -->
        <div class="flex flex-col gap-3">
          <span class="mb-1 text-xs font-semibold tracking-widest text-muted-foreground uppercase">Pages</span>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="m3-state-layer -ml-2 w-fit rounded-full px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Social -->
        <div class="flex flex-col gap-3">
          <span class="mb-1 text-xs font-semibold tracking-widest text-muted-foreground uppercase">Links</span>
          <div class="flex items-center gap-3 text-muted-foreground">
            <SocialLinks size="md" :isBrighter="true" />
            <a
              href="/rss.xml"
              title="RSS"
              target="_blank"
              rel="noopener noreferrer"
              class="m3-state-layer flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-orange-400"
            >
              <Rss class="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between gap-2 rounded-2xl bg-surface-container px-4 py-3 text-xs text-muted-foreground sm:flex-row">
        <span>© {{ brandYear }} Koha. All rights reserved.</span>
        <span>引用している文章・画像の著作権は引用元に帰属します。</span>
      </div>
    </div>
  </footer>
</template>
