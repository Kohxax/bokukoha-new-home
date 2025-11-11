\<script setup lang="ts">
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
  } 

  else {
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
</script>

<template>
  <header 
    class="
      sticky top-0 z-50 w-fullb shadow-lg bg-background/95 backdrop-blur-xl
      transition-transform duration-300 ease-in-out
    "
    :class="{ '-translate-y-full': !isVisible }"
  >
    <div class="flex h-14 items-center">
      
      <NuxtLink to="/" class="flex items-center space-x-3 pl-3 hover:scale-98 ransition-colors">
        <Avatar class="h-8 w-8">
          <img src="~/assets/img/icon_glass.png" alt="Koha" />
        </Avatar>
        <span class="font-bold text-lg">Koha</span>
      </NuxtLink>

      <nav class="flex ml-auto space-x-4 pr-5">
        <NuxtLink 
          to="/blog" 
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Blog
        </NuxtLink>
        <NuxtLink 
          to="/work" 
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Work
        </NuxtLink>
        <NuxtLink 
          to="/about" 
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          About
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>