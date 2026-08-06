<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(true)
const isScrolled = ref(false)
const lastScrollY = ref(0)

const handleScroll = () => {
  const currentScrollY = window.scrollY
  isScrolled.value = currentScrollY > 8 && currentScrollY < lastScrollY.value

  if (currentScrollY < 100) {
    isVisible.value = true
    lastScrollY.value = currentScrollY
    return
  }

  if (currentScrollY > lastScrollY.value) {
    isVisible.value = false
  } else {
    isVisible.value = true
  }

  lastScrollY.value = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const route = useRoute()

const navLinks = [
  { label: 'Blog', to: '/blog/page/1/', match: '/blog' },
  { label: 'Work', to: '/work/', match: '/work' },
  { label: 'About', to: '/about/', match: '/about' },
]

const isActive = (match: string) => route.path.startsWith(match)
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-transparent bg-background/95 backdrop-blur-md transition-[transform,background-color,border-color,box-shadow] duration-300 ease-in-out"
    :style="{
      borderBottomColor: isScrolled
        ? 'color-mix(in srgb, var(--border) 40%, transparent)'
        : 'transparent',
    }"
    :class="{
      '-translate-y-full': !isVisible,
      'bg-surface-container-low/75 shadow-(--elevation-1)': isScrolled,
    }"
  >
    <div class="flex h-14 items-center">
      <NuxtLink
        to="/"
        class="m3-state-layer ml-1 flex items-center gap-3 rounded-full px-2 py-1 text-foreground"
        aria-label="ホームに戻る"
      >
        <Avatar class="h-8 w-8">
          <img src="~/assets/img/icon_glass.webp" alt="Koha" />
        </Avatar>
        <span class="text-lg font-bold">ぼくこは.dev</span>
      </NuxtLink>

      <nav class="ml-auto flex items-center gap-4 pr-5" aria-label="メインナビゲーション">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="m3-state-layer relative -mx-2 rounded-full px-2 py-2 text-sm font-medium transition-colors before:absolute before:inset-x-2 before:bottom-0 before:h-0.5 before:rounded-full before:transition-colors"
          :class="
            isActive(link.match)
              ? 'text-foreground before:bg-foreground'
              : 'text-muted-foreground before:bg-transparent hover:text-foreground'
          "
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
