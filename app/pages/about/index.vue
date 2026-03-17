<script setup lang="ts">
import { Github } from 'lucide-vue-next'
import MisskeyIcon from '~/components/svg/MisskeyIcon.vue'
import XIcon from '~/components/svg/XIcon.vue'
import DiscordIcon from '~/components/svg/DiscordIcon.vue'

useSeoMeta({
  title: 'About',
  ogDescription: 'オタクの自己紹介ページ',
  twitterTitle: 'About',
  twitterDescription: 'オタクの自己紹介ページ',
})

const birthDate = '2004-08-27'

const links = [
  {
    title: 'GitHub',
    icon: Github,
    href: 'https://github.com/Kohxax',
  },
  {
    title: 'Misskey',
    icon: MisskeyIcon,
    href: 'https://mi.bokukoha.dev/@Koha',
  },
  {
    title: 'X',
    icon: XIcon,
    href: 'https://x.com/kohxax',
  },
  {
    title: 'Discord',
    icon: DiscordIcon,
    href: "https://discord.com/users/441869177389580308'",
  },
]

const games = [
  {
    title: '崩壊スターレイル',
    characters: '星銀 / 星アベ / アナアグ / 花火 など 雑食気味',
  },
  { title: '崩壊3rd', characters: 'ゼレブロ' },
  { title: 'PCゲー', characters: 'Minecraft / OverWatch / Rocket League / ンィー゛など' },
  { title: 'CS', characters: 'どう森シリーズ / モンハンシリーズ' },
]

const profile = [
  { label: '名前', value: 'こは' },
  { label: '誕生日', value: birthDate },
  { label: '言語', value: 'JPN 〇 / ENG △' },
  { label: '趣味', value: 'PCゲーム・散歩・飲酒・音楽・旅行' },
]
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <section class="flex flex-col items-center px-4 pt-16 pb-14 text-center sm:pt-24">
      <Avatar class="mb-3 h-28 w-28 shadow-xl" style="view-transition-name: main-avatar">
        <img src="~/assets/img/icon_glass.webp" alt="Koha" />
        <AvatarFallback>KH</AvatarFallback>
      </Avatar>

      <h1 class="mb-1 text-3xl font-bold tracking-tight">Koha</h1>
      <p class="mb-2 text-sm text-muted-foreground">@Kohxax / こは</p>

      <div class="flex gap-x-5 text-foreground">
        <a
          v-for="link in links"
          :key="link.title"
          :href="link.href"
          :alt="link.title"
          target="_blank"
          rel="noopener noreferrer"
          class="transition hover:scale-95 hover:opacity-80"
        >
          <component :is="link.icon" class="h-5 w-5" />
        </a>
      </div>
    </section>

    <main class="mx-auto w-full max-w-2xl px-6 pb-16">
      <section class="about-section">
        <h2 class="section-heading">PROFILE</h2>
        <div class="grid grid-cols-2 gap-x-8 gap-y-4">
          <div v-for="item in profile" :key="item.label">
            <dt class="text-xs text-muted-foreground">{{ item.label }}</dt>
            <dd class="mt-0.5 text-sm font-medium">{{ item.value }}</dd>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2 class="section-heading">GAMES &amp; CP</h2>
        <dl class="space-y-3">
          <div
            v-for="game in games"
            :key="game.title"
            class="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <dt class="min-w-32 shrink-0 text-sm font-medium">{{ game.title }}</dt>
            <dd class="text-sm text-muted-foreground">{{ game.characters }}</dd>
          </div>
        </dl>
      </section>

      <section class="about-section">
        <h2 class="section-heading">ABOUT ME</h2>
        <p class="text-sm leading-relaxed text-muted-foreground">
          インターネットではこはと名乗っています。簡単なプロフィールは上に書いてある通りです。わからんことを調べること、良い物語を見て最高に苦しい気分になることが大好きです。
        </p>
        <p class="text-sm leading-relaxed text-muted-foreground">
          色々知りたいと思ってくださった方はmisskeyの普段の投稿でも見ていただければと思います。よろしくお願いします。
        </p>
      </section>

      <section class="about-section border-b-0! pb-0!">
        <h2 class="section-heading">ABOUT THIS SITE</h2>
        <p class="text-sm leading-relaxed text-muted-foreground">
          ぼくこは.devは、こはが0から作った個人サイトです。今ご覧になられているプロフィールに加えて、私がやったことや体験したことなんかを文章と写真でまとめたBlogセクション、制作物をまとめたWorkセクションがあります。
        </p>
        <p class="text-sm leading-relaxed text-muted-foreground">
          まともなサイトを作るのは初めてのことなので、何かご意見等あれば積極的に共有してくださるとうれしいです！
        </p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.about-section {
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.section-heading {
  margin-bottom: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}
</style>
