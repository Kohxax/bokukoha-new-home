import { defineContentConfig, defineCollection, defineCollectionSource, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { asRobotsCollection } from '@nuxtjs/robots/content'

const cmsApiUrl = process.env.CMS_API_URL

/**
 * Reconstruct a markdown file string with YAML frontmatter from a CMS API response.
 * `getItem` must return raw file content (string), so we serialize the JSON fields back to YAML.
 */
function buildMarkdown(data: Record<string, any>): string {
  const lines: string[] = ['---']

  const str = (v: unknown) => JSON.stringify(String(v ?? ''))

  if (data.title !== undefined) lines.push(`title: ${str(data.title)}`)
  if (data.date !== undefined) lines.push(`date: ${str(data.date)}`)
  if (data.category !== undefined) lines.push(`category: ${str(data.category)}`)
  if (Array.isArray(data.tags) && data.tags.length > 0) {
    lines.push('tags:')
    for (const tag of data.tags) lines.push(`  - ${str(tag)}`)
  } else {
    lines.push('tags: []')
  }
  if (data.coverImage !== undefined) lines.push(`coverImage: ${str(data.coverImage)}`)
  lines.push(`draft: ${Boolean(data.draft)}`)
  if (data.description !== undefined) lines.push(`description: ${str(data.description)}`)

  lines.push('---', '', data.rawbody ?? '')
  return lines.join('\n')
}

function makeCmsSource(collection: 'blog' | 'work') {
  return defineCollectionSource({
    getKeys: async () => {
      const res = await fetch(`${cmsApiUrl}/api/${collection}`)
      if (!res.ok) throw new Error(`CMS ${collection} list failed: ${res.status}`)
      const articles: { slug: string }[] = await res.json()
      return articles.map(a => `${collection}/${a.slug}/index.md`)
    },
    getItem: async (key: string) => {
      const slug = key.replace(`${collection}/`, '').replace('/index.md', '')
      const res = await fetch(`${cmsApiUrl}/api/${collection}/${slug}`)
      if (!res.ok) throw new Error(`CMS ${collection}/${slug} not found: ${res.status}`)
      const data = await res.json()
      return buildMarkdown(data)
    },
  })
}

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: cmsApiUrl ? [makeCmsSource('blog'), { include: 'blog/**/*.md' }] : { include: 'blog/**/*.md' },
      schema: z.object({
        title: z.string(),
        date: z.string(),
        category: z.string(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        coverImage: z.string(),
        draft: z.boolean().default(true),
        rawbody: z.string().optional(),
      }),
    }),

    work: defineCollection({
      type: 'page',
      source: cmsApiUrl ? [makeCmsSource('work'), { include: 'work/**/*.md' }] : { include: 'work/**/*.md' },
      schema: z.object({
        title: z.string(),
        date: z.string(),
        category: z.string(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        coverImage: z.string(),
        draft: z.boolean().default(true),
      }),
    }),

    content: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: { include: 'blog/**/*.md' },
      }),
      asRobotsCollection({
        type: 'page',
        source: { include: '**/*.md' },
      }),
    ),
  },

  components: {
    img: 'ProseImg',
  },
})
