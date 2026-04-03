import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { asRobotsCollection } from '@nuxtjs/robots/content'
import { asOgImageCollection } from 'nuxt-og-image/content'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: 'page',
            source: { include: 'blog/**/*.md' },
            schema: z.object({
                title: z.string(),
                date: z.string(),
                category: z.string(),
                tags: z.array(z.string()).optional(),
                coverImage: z.string(),
                draft: z.boolean().default(true),
                rawbody: z.string()
            })
        }),

        work: defineCollection({
            type: 'page',
            source: { include: 'work/**/*.md' },
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
                source: { include: 'blog/**/*.md' }
            }),

            asRobotsCollection({
                type: 'page',
                source: { include: '**/*.md' }
            }),
        ),
    },

    components: {
        img: 'ProseImg',
    },
})
