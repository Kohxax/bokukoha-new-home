<script setup lang="ts">
import { Github } from 'lucide-vue-next'
import MisskeyIcon from '~/components/svg/MisskeyIcon.vue'
import XIcon from '~/components/svg/XIcon.vue'
import DiscordIcon from '~/components/svg/DiscordIcon.vue'

const props = defineProps<{
  size?: 'sm' | 'md' | 'lg'
  isBrighter?: boolean
}>()

const links = [
  { title: 'GitHub', icon: Github, href: 'https://github.com/Kohxax' },
  { title: 'Misskey', icon: MisskeyIcon, href: 'https://mi.bokukoha.dev/@Koha' },
  { title: 'X', icon: XIcon, href: 'https://x.com/kohxax' },
  { title: 'Discord', icon: DiscordIcon, href: 'https://discord.com/users/441869177389580308' },
]

const iconClass = computed(
  () =>
    ({
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    })[props.size ?? 'md'],
)
</script>

<template>
  <div class="flex items-center gap-x-5">
    <a
      v-for="link in links"
      :key="link.title"
      :href="link.href"
      :title="link.title"
      target="_blank"
      rel="noopener noreferrer"
      class="hover:scale-98 transition"
      :class="isBrighter ? 'hover:text-foreground' : 'hover:opacity-75'"
    >
      <component :is="link.icon" :class="iconClass" />
    </a>
  </div>
</template>
