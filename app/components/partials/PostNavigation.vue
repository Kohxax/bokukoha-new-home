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
  <nav
    v-if="next || prev"
    aria-label="前後の記事"
    class="grid grid-cols-2 gap-2 pt-6 sm:gap-4"
  >
    <NuxtLink
      v-if="next"
      :to="next.path"
      class="m3-interactive-card m3-state-layer group flex min-h-20 items-center gap-2 rounded-2xl bg-surface-container p-3 text-left sm:min-h-24 sm:gap-3 sm:rounded-3xl sm:p-4"
    >
      <span
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-muted-foreground transition-colors group-hover:text-foreground sm:size-10"
        aria-hidden="true"
      >
        <ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-0.5 sm:h-5 sm:w-5" />
      </span>
      <div class="min-w-0">
        <div class="mb-1 text-xs font-medium tracking-wide text-muted-foreground">次の記事</div>
        <div class="line-clamp-2 text-sm font-medium leading-relaxed">{{ next.title }}</div>
      </div>
    </NuxtLink>

    <NuxtLink
      v-if="prev"
      :to="prev.path"
      class="m3-interactive-card m3-state-layer group col-start-2 flex min-h-20 items-center justify-end gap-2 rounded-2xl bg-surface-container p-3 text-right sm:min-h-24 sm:gap-3 sm:rounded-3xl sm:p-4"
    >
      <div class="min-w-0">
        <div class="mb-1 text-xs font-medium tracking-wide text-muted-foreground">前の記事</div>
        <div class="line-clamp-2 text-sm font-medium leading-relaxed">{{ prev.title }}</div>
      </div>
      <span
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-muted-foreground transition-colors group-hover:text-foreground sm:size-10"
        aria-hidden="true"
      >
        <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5 sm:h-5 sm:w-5" />
      </span>
    </NuxtLink>
  </nav>
</template>
