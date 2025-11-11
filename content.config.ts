import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: 'page',
            source: 'blog/**/*.md',
            schema: z.object({
                title: z.string(),
                date: z.string(),
                category: z.string(),
                tags: z.array(z.string()).optional(),
                coverImage: z.string(),
                draft: z.boolean().default(true)
            })

        }),

        work: defineCollection({
            type: 'page',
            source: 'work/**/*.md',
            schema: z.object({
                title: z.string(),
                date: z.string(),
                category: z.string(),
                tags: z.array(z.string()).optional(),
                coverImage: z.string(),
                draft: z.boolean().default(true)
            })
        }),
    }
})
