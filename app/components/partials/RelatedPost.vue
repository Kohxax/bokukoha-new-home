<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  category: String,
  currentPath: String,
})

const { data: related } = await useAsyncData(`related-${props.category}-${props.currentPath}`, () =>
  queryCollection('blog')
    .where('category', '=', props.category)
    .where('path', '!=', props.currentPath)
    .where('draft', '=', '0')
    .select('title', 'path', 'date', 'category', 'coverImage')
    .order('date', 'DESC')
    .limit(5)
    .all(),
)
const scrollContainer = ref(null)
const hasOverflow = ref(false)
const thumbWidth = ref(0)
const thumbLeft = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startScrollLeft = ref(0)

const updateScroll = () => {
  if (!scrollContainer.value) return

  const el = scrollContainer.value
  const { scrollLeft, scrollWidth, clientWidth } = el

  hasOverflow.value = scrollWidth > clientWidth

  if (hasOverflow.value) {
    thumbWidth.value = (clientWidth / scrollWidth) * 100
    thumbLeft.value = (scrollLeft / scrollWidth) * 100
  }
}

const onWheel = (e) => {
  if (scrollContainer.value) {
    if (e.deltaY !== 0) {
      scrollContainer.value.scrollBy({
        left: e.deltaY * 3,
        behavior: 'smooth',
      })
    }
  }
}

const onDragStart = (e) => {
  if (!scrollContainer.value || !hasOverflow.value) return
  isDragging.value = true
  startX.value = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  startScrollLeft.value = scrollContainer.value.scrollLeft
  document.body.style.userSelect = 'none' // Prevent text selection
}

const onDragMove = (e) => {
  if (!isDragging.value || !scrollContainer.value) return
  e.preventDefault()

  const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
  const deltaX = currentX - startX.value

  const scrollRatio = scrollContainer.value.scrollWidth / scrollContainer.value.clientWidth

  scrollContainer.value.scrollLeft = startScrollLeft.value + deltaX * scrollRatio
}

const onDragEnd = () => {
  isDragging.value = false
  document.body.style.userSelect = '' // Restore text selection
}

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', updateScroll)
  }
  window.addEventListener('resize', updateScroll)
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
  document.addEventListener('touchmove', onDragMove, { passive: false })
  document.addEventListener('touchend', onDragEnd)

  setTimeout(updateScroll, 100)
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', updateScroll)
  }
  window.removeEventListener('resize', updateScroll)
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  document.removeEventListener('touchmove', onDragMove)
  document.removeEventListener('touchend', onDragEnd)
})
</script>

<template>
  <div v-if="related?.length" class="mt-3 pt-8 space-y-6">
    <h2 class="text-lg font-semibold tracking-tight">関連する投稿</h2>

    <div class="relative group">
      <div
        ref="scrollContainer"
        @wheel.prevent="onWheel"
        class="flex gap-4 overflow-x-auto pb-7 scrollbar-none [&::-webkit-scrollbar]:hidden mx-auto max-w-full px-1 sm:px-0"
        :class="[isDragging ? 'pointer-events-none' : 'snap-x snap-proximity']"
        style="scrollbar-width: none; -ms-overflow-style: none"
      >
        <Card
          v-for="post in related"
          :key="post.path"
          class="overflow-hidden transition-all hover:opacity-80 hover:scale-[0.99] shrink-0 w-[285px]"
          :class="[isDragging ? '' : 'snap-center']"
        >
          <NuxtLink :to="post.path">
            <CoverImg
              :src="post.coverImage"
              :alt="post.title"
              class="aspect-video w-full object-cover"
            />
            <CardHeader>
              <div class="flex items-center justify-between text-sm pt-4 text-muted-foreground">
                <span>{{ post.category }}</span>
                <span>{{ post.date }}</span>
              </div>
              <CardTitle class="pt-1 text-lg line-clamp-2">{{ post.title }}</CardTitle>
            </CardHeader>
          </NuxtLink>
        </Card>
      </div>

      <div
        v-if="hasOverflow"
        class="absolute bottom-0 left-4 right-4 h-5 group/scrollbar cursor-grab active:cursor-grabbing flex items-center justify-center -translate-y-[2px]"
        @mousedown="onDragStart"
        @touchstart.passive="onDragStart"
      >
        <div
          class="w-full h-[3px] bg-secondary/30 rounded-full mx-1 sm:mx-0 overflow-hidden relative"
          :class="{ 'bg-secondary/50': isDragging }"
        >
          <div
            class="absolute top-0 bottom-0 bg-primary/30 group-hover/scrollbar:bg-primary/50 rounded-full ease-out"
            :class="isDragging ? 'bg-primary/60 transition-none' : 'transition-all duration-75'"
            :style="{ width: `${thumbWidth}%`, left: `${thumbLeft}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
