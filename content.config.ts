import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { asRobotsCollection } from '@nuxtjs/robots/content'
import { asOgImageCollection } from 'nuxt-og-image/content'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: 'page',
            source: 'blog/**/',
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
            source: 'work/**/',
            schema: z.object({
                title: z.string(),
                date: z.string(),
                category: z.string(),
                tags: z.array(z.string()).optional(),
                coverImage: z.string(),
                draft: z.boolean().default(true)
            })
        }),

        content: defineCollection(
            asSitemapCollection({
                type: 'page',
                source: 'blog/**/'
            }),

            asRobotsCollection({
                type: 'page',
                source: '**'
            }),      
        ),
    },
})
