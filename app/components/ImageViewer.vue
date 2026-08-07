<script setup lang="ts">
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-vue-next'

const { $imageViewer } = useNuxtApp()
const { isOpen, currentImage, close, next, prev, hasNext, hasPrev, currentIndex, images } = $imageViewer

const transitionName = ref('slide-next')
const isZoomed = ref(false)
const showControls = ref(true)
const touchStart = ref<{ x: number; y: number } | null>(null)

const handleNext = () => {
  if (isZoomed.value) return // Disable nav when zoomed
  transitionName.value = 'slide-next'
  next()
}

const handlePrev = () => {
  if (isZoomed.value) return // Disable nav when zoomed
  transitionName.value = 'slide-prev'
  prev()
}

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value
}

const toggleControls = () => {
  showControls.value = !showControls.value
}

// Reset zoom on image change
watch(currentImage, () => {
  isZoomed.value = false
  showControls.value = true
})

// Lock body scroll when open
watch(isOpen, (val) => {
  if (import.meta.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

// Swipe Logic
const handleTouchStart = (e: TouchEvent) => {
  if (isZoomed.value || e.touches.length === 0) return
  touchStart.value = {
    x: e.touches[0]!.clientX,
    y: e.touches[0]!.clientY
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  const start = touchStart.value
  if (!start || isZoomed.value || e.changedTouches.length === 0) return

  const touchEndX = e.changedTouches[0]!.clientX
  const touchEndY = e.changedTouches[0]!.clientY
  
  const deltaX = touchEndX - start.x
  const deltaY = touchEndY - start.y

  // Swipe Down to Close (Vertical swipe > 100px, Horizontal < 50px to avoid diagonal)
  if (deltaY > 100 && Math.abs(deltaX) < 80) {
    close()
    touchStart.value = null
    return
  }

  // Horizontal Swipe for Navigation
  if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
    if (deltaX > 0) {
      handlePrev()
    } else {
      handleNext()
    }
  }

  touchStart.value = null
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
  } else if (e.key === ' ') {
    e.preventDefault()
    toggleZoom()
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
      class="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      @click="close"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <!-- Controls Container -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-show="showControls" class="contents">
          <!-- Counter -->
          <div class="absolute top-4 left-4 px-4 py-2 text-white/90 bg-black/20 rounded-full backdrop-blur-md z-20 font-medium select-none">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>

          <!-- Close button -->
          <Button
            variant="ghost"
            size="icon-lg"
            class="absolute top-4 right-4 z-20 bg-black/30 text-white/80 backdrop-blur-md hover:text-white focus-visible:ring-white"
            aria-label="画像ビューアを閉じる"
            @click.stop="close"
          >
            <X class="size-7" />
          </Button>

          <!-- Zoom button -->
          <Button
            variant="ghost"
            size="icon-lg"
            class="absolute top-4 right-18 z-20 bg-black/30 text-white/80 backdrop-blur-md hover:text-white focus-visible:ring-white"
            :aria-label="isZoomed ? '画像を縮小' : '画像を拡大'"
            :aria-pressed="isZoomed"
            @click.stop="toggleZoom"
          >
            <ZoomIn v-if="!isZoomed" class="size-7" />
            <ZoomOut v-else class="size-7" />
          </Button>

          <!-- Prev button -->
          <Button
            v-if="hasPrev"
            variant="ghost"
            size="icon-lg"
            class="absolute left-2 z-20 bg-black/30 text-white/90 backdrop-blur-md hover:text-white focus-visible:ring-white md:left-4"
            aria-label="前の画像"
            @click.stop="handlePrev"
          >
            <ChevronLeft class="size-8 md:size-10" />
          </Button>

          <!-- Next button -->
          <Button
            v-if="hasNext"
            variant="ghost"
            size="icon-lg"
            class="absolute right-2 z-20 bg-black/30 text-white/90 backdrop-blur-md hover:text-white focus-visible:ring-white md:right-4"
            aria-label="次の画像"
            @click.stop="handleNext"
          >
            <ChevronRight class="size-8 md:size-10" />
          </Button>

          <!-- Caption (optional) -->
          <div v-if="currentImage.alt" class="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-20">
            <span class="inline-block bg-black/60 text-white/90 px-6 py-3 rounded-full text-sm backdrop-blur-md shadow-lg max-w-[90vw] truncate">
              {{ currentImage.alt }}
            </span>
          </div>
        </div>
      </Transition>

      <!-- Image Container -->
      <div 
        class="relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-300"
        :class="{ 'cursor-zoom-in': !isZoomed, 'cursor-zoom-out': isZoomed }"
        @click.stop="toggleControls"
      >
        <Transition :name="transitionName" mode="out-in">
          <img
            :key="currentImage.src"
            :src="currentImage.src"
            :alt="currentImage.alt"
            class="max-w-full max-h-full object-contain rounded-md shadow-2xl select-none transition-transform duration-300 ease-in-out"
            :class="{ 'scale-[2] cursor-move': isZoomed }"
            @click.stop="toggleControls"
          />
        </Transition>
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
  transition: all 0.2s ease;
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Slide Prev Animation */
.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
