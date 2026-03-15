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
  { title: '崩壊スターレイル', characters: '銀狼 / 花火 / ヘルタ / アベンチュリン / キュレネ' },
  { title: '崩壊3rd', characters: 'ゼーレ / ブローニャ / エリシア' },
  { title: 'PCゲー', characters: 'Minecraft / MHWilds / Rocket League / ンィー゛など' },
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

      <p class="mb-3 text-sm text-muted-foreground"></p>

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
        <h2 class="section-heading">GAMES &amp; CHARACTERS</h2>
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
        <h2 class="section-heading">MUSIC</h2>
        <p class="text-sm leading-relaxed text-muted-foreground">
          Aiobahn,
          rejectionみたいな電子音楽、エロゲ曲、アニソン、崩壊シリーズの劇中歌が好き。音楽の趣味が合う人はぜひ教えてください。
        </p>
        <p class="text-sm leading-relaxed text-muted-foreground">
          音響機器もそこそこ好きです。A5000, ifi go barユーザー。
        </p>
      </section>

      <section class="about-section">
        <h2 class="section-heading">HOME SERVER</h2>
        <p class="text-sm leading-relaxed text-muted-foreground">
          メルカリとかでパーツ拾って組んだPCにProxmox入れて遊んでます。CPUはi7-6700k,
          RAMは48GBです。色々とやりたいことはあるんですが、基本的にお金とストレージ不足；；
        </p>
      </section>

      <section class="about-section border-b-0! pb-0!">
        <h2 class="section-heading">ETC.</h2>
        <p class="text-sm leading-relaxed text-muted-foreground">
          ここまで読んでくださってありがとうございます。趣味あう人と話すのは楽しくて好きなので、気軽に話しかけてください。Discord含むゲームとかのフレ申請は知り合いなら通します！よろしくお願いします！
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
