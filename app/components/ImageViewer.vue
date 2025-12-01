<script setup lang="ts">
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { $imageViewer } = useNuxtApp()
const { isOpen, currentImage, close, next, prev, hasNext, hasPrev } = $imageViewer

const transitionName = ref('slide-next')

const handleNext = () => {
  transitionName.value = 'slide-next'
  next()
}

const handlePrev = () => {
  transitionName.value = 'slide-prev'
  prev()
}

// Close on Escape key, Navigate on Arrow keys
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return

  if (e.key === 'Escape') {
    close()
  } else if (e.key === 'ArrowRight') {
    handleNext()
  } else if (e.key === 'ArrowLeft') {
    handlePrev()
  }
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen && currentImage"
      class="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
      @click="close"
    >
      <!-- Close button -->
      <button
        class="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition-colors z-20 backdrop-blur-md"
        @click.stop="close"
      >
        <X class="w-8 h-8" />
      </button>

      <!-- Prev button -->
      <button
        v-if="hasPrev"
        class="absolute left-2 md:left-4 p-3 text-white/90 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition-all z-20 backdrop-blur-md hover:scale-110"
        @click.stop="handlePrev"
      >
        <ChevronLeft class="w-8 h-8 md:w-10 md:h-10" />
      </button>

      <!-- Next button -->
      <button
        v-if="hasNext"
        class="absolute right-2 md:right-4 p-3 text-white/90 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition-all z-20 backdrop-blur-md hover:scale-110"
        @click.stop="handleNext"
      >
        <ChevronRight class="w-8 h-8 md:w-10 md:h-10" />
      </button>

      <!-- Image Container -->
      <div class="relative w-full h-full flex items-center justify-center overflow-hidden">
        <Transition :name="transitionName" mode="out-in">
          <img
            :key="currentImage.src"
            :src="currentImage.src"
            :alt="currentImage.alt"
            class="max-w-full max-h-full object-contain rounded-md shadow-2xl select-none"
            @click.stop
          />
        </Transition>
      </div>
      
      <!-- Caption (optional) -->
      <div v-if="currentImage.alt" class="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-20">
        <span class="inline-block bg-black/60 text-white/90 px-6 py-3 rounded-full text-sm backdrop-blur-md shadow-lg max-w-[90vw] truncate">
          {{ currentImage.alt }}
        </span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Slide Next Animation */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.1s ease;
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Slide Prev Animation */
.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
