<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(true)
const isScrolled = ref(false)
const lastScrollY = ref(0)

const handleScroll = () => {
  const currentScrollY = window.scrollY

  if (currentScrollY <= 0) {
    isVisible.value = true
    isScrolled.value = false
    lastScrollY.value = 0
    return
  }

  if (currentScrollY > lastScrollY.value) {
    isVisible.value = false
    isScrolled.value = false
  } else {
    isVisible.value = true
    isScrolled.value = true
  }

  lastScrollY.value = currentScrollY
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
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
    class="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-xl transition-[transform,background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none"
    :class="{
      '-translate-y-full': !isVisible,
      'bg-surface-container-low shadow-(--elevation-1)': isScrolled,
    }"
  >
    <div class="mx-auto flex h-16 max-w-8xl items-center gap-1 px-3 sm:px-6">
      <NuxtLink
        to="/"
        class="m3-state-layer flex h-12 shrink-0 items-center gap-2.5 rounded-full px-2 text-foreground"
        aria-label="ホームに戻る"
      >
        <Avatar class="h-8 w-8">
          <img src="~/assets/img/icon_glass.webp" alt="Koha" />
        </Avatar>
        <span class="hidden text-lg font-bold tracking-tight sm:inline">ぼくこは.dev</span>
      </NuxtLink>

      <nav class="ml-auto flex items-center gap-1" aria-label="メインナビゲーション">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="m3-state-layer flex h-10 items-center rounded-full px-2.5 text-sm font-medium transition-colors min-[360px]:px-3 sm:px-4"
          :aria-current="isActive(link.match) ? 'page' : undefined"
          :class="
            isActive(link.match)
              ? 'bg-primary-container text-primary-container-foreground'
              : 'text-muted-foreground hover:text-foreground'
          "
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
