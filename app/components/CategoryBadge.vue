<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  category: string
  to?: string
  count?: number
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="cn('m3-state-layer inline-flex min-h-8 w-fit items-center gap-1.5 rounded-full bg-primary-container px-3 py-1 text-sm font-medium text-primary-container-foreground transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring', props.class)"
  >
    <span>{{ category }}</span>
    <span v-if="count !== undefined" class="text-xs opacity-75">{{ count }}</span>
  </NuxtLink>
  <span
    v-else
    :class="cn('inline-flex min-h-8 w-fit items-center gap-1.5 rounded-full bg-primary-container px-3 py-1 text-sm font-medium text-primary-container-foreground', props.class)"
  >
    <span>{{ category }}</span>
    <span v-if="count !== undefined" class="text-xs opacity-75">{{ count }}</span>
  </span>
</template>
