import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
        type: 'page',
        source: 'blog/*.md',

    }),

    work: defineCollection({
        type: 'page',
        source: 'work/*.md',
    }),
  }
})
