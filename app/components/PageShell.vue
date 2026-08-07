<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    as?: string
    variant?: 'normal' | 'list' | 'article'
    class?: HTMLAttributes['class']
  }>(),
  {
    as: 'div',
    variant: 'normal',
  },
)

const widths = {
  normal: 'max-w-5xl',
  list: 'max-w-[1536px]',
  article: 'max-w-[1440px]',
} as const
</script>

<template>
  <component
    :is="props.as"
    :class="cn('mx-auto w-full px-4 sm:px-6', widths[props.variant], props.class)"
  >
    <slot />
  </component>
</template>
