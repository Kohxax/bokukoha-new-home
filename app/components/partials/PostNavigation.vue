<script setup lang="ts">
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  currentPath: String,
})

const { data: surround } = await useAsyncData(`${props.currentPath}-surround`, () =>
  queryCollectionItemSurroundings('blog', props.currentPath ?? '', {
    before: 1,
    after: 1,
    fields: ['title', 'path'],
  })
    .where('draft', '=', '0')
    .order('date', 'DESC'),
)

const next = computed(() => surround.value?.[0] ?? null)
const prev = computed(() => surround.value?.[1] ?? null)
</script>

<template>
  <div v-if="next || prev" class="pt-6 grid grid-cols-2 gap-4">
    <NuxtLink
      v-if="next"
      :to="next.path"
      class="group flex items-center gap-2 py-2 transition-opacity hover:opacity-60"
    >
      <ArrowLeft
        class="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1"
      />
      <div class="min-w-0">
        <div class="text-xs text-muted-foreground">次の記事</div>
        <div class="truncate text-sm">{{ next.title }}</div>
      </div>
    </NuxtLink>
    <div v-else />

    <NuxtLink
      v-if="prev"
      :to="prev.path"
      class="group flex items-center justify-end gap-2 py-2 text-right transition-opacity hover:opacity-60"
    >
      <div class="min-w-0">
        <div class="text-xs text-muted-foreground">前の記事</div>
        <div class="truncate text-sm">{{ prev.title }}</div>
      </div>
      <ArrowRight
        class="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
      />
    </NuxtLink>
    <div v-else />
  </div>
</template>
