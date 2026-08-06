<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(true)
const isScrolled = ref(false)
const lastScrollY = ref(0)

const handleScroll = () => {
  const currentScrollY = window.scrollY
  isScrolled.value = currentScrollY > 8

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
    class="sticky top-0 z-50 w-full border-b border-transparent bg-background/92 backdrop-blur-md transition-[transform,background-color,border-color,box-shadow] duration-300 ease-in-out"
    :class="{
      '-translate-y-full': !isVisible,
      'border-border/60 bg-surface-container-low/95 shadow-[var(--elevation-1)]': isScrolled,
    }"
  >
    <div class="flex h-16 items-center px-2 sm:px-3">
      <NuxtLink
        to="/"
        class="m3-state-layer flex h-12 items-center gap-3 rounded-full px-2 text-foreground"
        alt="ホームに戻る"
      >
        <Avatar class="h-9 w-9">
          <img src="~/assets/img/icon_glass.webp" alt="Koha" />
        </Avatar>
        <span class="hidden font-bold text-lg sm:inline">ぼくこは.dev</span>
      </NuxtLink>

      <nav class="ml-auto flex items-center gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="m3-state-layer flex h-10 items-center rounded-full px-3 text-sm font-medium transition-colors sm:px-4"
          :class="
            isActive(link.match)
              ? 'bg-brand/15 text-brand'
              : 'text-muted-foreground hover:text-foreground'
          "
          :alt="link.label"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
