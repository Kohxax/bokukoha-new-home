<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(true)
const lastScrollY = ref(0)

const handleScroll = () => {
  const currentScrollY = window.scrollY

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
    class="sticky top-0 z-50 w-full shadow-lg bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out"
    :class="{ '-translate-y-full': !isVisible }"
  >
    <div class="flex h-14 items-center">
      <NuxtLink to="/" class="flex items-center space-x-3 pl-3 hover:scale-99 hover:opacity-80 transition-all" alt="ホームに戻る">
        <Avatar class="h-8 w-8">
          <img src="~/assets/img/icon_glass.webp" alt="Koha" />
        </Avatar>
        <span class="font-bold text-lg">ぼくこは.dev</span>
      </NuxtLink>

      <nav class="flex ml-auto space-x-4 pr-5">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium transition-colors hover:text-foreground"
          :class="isActive(link.match) ? 'text-foreground' : 'text-muted-foreground'"
          :alt="link.label"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
