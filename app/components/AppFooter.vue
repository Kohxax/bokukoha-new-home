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
const currentYear = new (Date)().getFullYear()

const brandYear = computed(() => {
  return launchYear === currentYear ? `${launchYear}` : `${launchYear}-${currentYear}`
})
</script>

<template>
  <footer class="w-full bg-background border-t border-border mt-12">
    <div class="container mx-auto max-w-5xl px-6 py-8">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        <!-- Brand -->
        <div class="flex flex-col gap-1.5">
          <NuxtLink to="/" class="font-bold text-base hover:opacity-80 transition">
            ぼくこは.dev
          </NuxtLink>
          <p class="text-muted-foreground text-xs">
            ぼくこは.devはこはのプロフィールやブログ記事、ポートフォリオをまとめた個人サイトです。
          </p>
        </div>

        <!-- Nav -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1">Pages</span>
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Social -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1">Links</span>
          <div class="flex items-center gap-4 text-muted-foreground">
            <SocialLinks size="md" :isBrighter="true" />
            <a
              href="/rss.xml"
              title="RSS"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-orange-400 transition-colors"
            >
              <Rss class="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-border pt-5 flex flex-col sm:flex-row justify-between items-center gap-1 text-xs text-muted-foreground">
        <span>© {{ brandYear }} Koha. All rights reserved.</span>
        <span>引用している文章・画像の著作権は引用元に帰属します。</span>
      </div>
    </div>
  </footer>
</template>
