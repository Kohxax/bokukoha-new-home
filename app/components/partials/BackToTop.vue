<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-vue-next'

const show = ref(false)

const handleScroll = () => {
  show.value = window.scrollY > 400
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition name="fade">
    <Button
      v-if="show"
      @click="scrollToTop"
      size="icon"
      variant="secondary"
      class="fixed bottom-6 right-6 shadow-lg hover:scale-95 transition-all backdrop-blur-xl rounded-full z-50"
      style="view-transition-name: back-to-top"
    >
      <ArrowUp class="w-7 h-7" />
    </Button>
  </Transition>
</template>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
</style>
