import type { H3Event } from 'h3'

export interface RelatedPost {
  title: string
  path: string
  date: string
  category: string
  coverImage: string
}

type RelatedMap = Record<string, RelatedPost[]>

interface PostRow {
  title: string
  path: string
  date: string
  category: string
  coverImage: string
  tags?: string[]
  body: unknown
}

interface ScoredEntry {
  j: number
  score: number
  hasContentSignal: boolean
}

let cached: Promise<RelatedMap> | null = null

// Recursively extract plain text from @nuxt/content v3 MDC AST body
function extractText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (node.type === 'text') return node.value ?? ''
  if (Array.isArray(node.children)) {
    return node.children.map(extractText).join(' ')
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join(' ')
  }
  return ''
}

function tokenize(text: string): string[] {
  const clean = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/::[\w-]+\{[^}]*\}::/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[.*?\]\(.*?\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_~>|=\-\[\](){}`]/g, ' ')

  const tokens: string[] = []

  const asciiRe = /[a-zA-Z][a-zA-Z0-9]*/g
  for (const m of clean.matchAll(asciiRe)) {
    const w = m[0].toLowerCase()
    if (w.length >= 2) tokens.push(w)
  }

  // Japanese and Chinese text: use character bigrams within each word-like run.
  // This avoids treating whitespace, punctuation, and frequent one-character words
  // as a relevance signal.
  const cjkRuns = clean.match(/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}々ー]+/gu) ?? []
  for (const run of cjkRuns) {
    for (let i = 0; i < run.length - 1; i++) {
      tokens.push(run.slice(i, i + 2))
    }
  }

  return tokens
}

function buildTf(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>()
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1)
  const total = tokens.length || 1
  for (const [k, v] of tf) tf.set(k, v / total)
  return tf
}

function cosineSim(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (const [k, va] of a) {
    normA += va * va
    const vb = b.get(k)
    if (vb !== undefined) dot += va * vb
  }
  for (const [, vb] of b) normB += vb * vb
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase()
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0

  let intersection = 0
  for (const value of a) {
    if (b.has(value)) intersection++
  }

  return intersection / (a.size + b.size - intersection)
}

function dateTimestamp(date: string): number {
  const timestamp = Date.parse(date)
  return Number.isFinite(timestamp) ? timestamp : 0
}

function recencyScore(date: string, newestTimestamp: number): number {
  const timestamp = dateTimestamp(date)
  if (!timestamp || !newestTimestamp) return 0

  const ageInDays = Math.max(0, (newestTimestamp - timestamp) / 86_400_000)
  return Math.exp(-ageInDays / 365)
}

function newestFirst(a: PostRow, b: PostRow): number {
  return dateTimestamp(b.date) - dateTimestamp(a.date)
}

async function compute(event: H3Event): Promise<RelatedMap> {
  const posts = await queryCollection(event, 'blog')
    .where('draft', '=', '0')
    .select('title', 'path', 'date', 'category', 'coverImage', 'tags', 'body')
    .order('date', 'DESC')
    .all() as PostRow[]

  const tokensList: string[][] = posts.map((p: PostRow) => {
    const titleTokens = tokenize(p.title)
    const bodyTokens = tokenize(extractText(p.body))
    // Give title matches a stronger influence than matches found only in the body.
    return [...titleTokens, ...titleTokens, ...titleTokens, ...bodyTokens]
  })

  const tagSets = posts.map((post) => new Set(
    (post.tags ?? []).map(normalizeLabel).filter(Boolean),
  ))
  const categories = posts.map((post) => normalizeLabel(post.category ?? ''))
  const newestTimestamp = Math.max(...posts.map((post) => dateTimestamp(post.date)), 0)

  const N = posts.length
  const df = new Map<string, number>()
  for (const tokens of tokensList) {
    for (const t of new Set(tokens)) df.set(t, (df.get(t) ?? 0) + 1)
  }
  const idf = (term: string) => Math.log((N + 1) / ((df.get(term) ?? 0) + 1)) + 1

  const vectors: Map<string, number>[] = tokensList.map((tokens) => {
    const tf = buildTf(tokens)
    const vec = new Map<string, number>()
    for (const [term, tfVal] of tf) vec.set(term, tfVal * idf(term))
    return vec
  })

  const TOP_N = 5
  const map: RelatedMap = {}

  for (let i = 0; i < posts.length; i++) {
    const current = posts[i]

    const scored: ScoredEntry[] = posts
      .map((_p: PostRow, j: number) => {
        const textSimilarity = cosineSim(vectors[i], vectors[j])
        const tagSimilarity = jaccardSimilarity(tagSets[i], tagSets[j])
        const categorySimilarity = categories[i] !== '' && categories[i] === categories[j] ? 1 : 0
        const freshness = recencyScore(posts[j].date, newestTimestamp)

        return {
          j,
          // Text, tags, and category identify topical relevance; recency only breaks
          // close calls so that a newer, equally relevant post is preferred.
          score: textSimilarity * 0.55 + tagSimilarity * 0.25 + categorySimilarity * 0.15 + freshness * 0.05,
          hasContentSignal: textSimilarity > 0 || tagSimilarity > 0,
        }
      })
      .filter(({ j }: ScoredEntry) => j !== i && j >= 0)
      .sort((a: ScoredEntry, b: ScoredEntry) => {
        if (b.score !== a.score) return b.score - a.score
        return newestFirst(posts[a.j], posts[b.j])
      })

    const result: RelatedPost[] = []
    const used = new Set<number>([i])

    for (const { j, hasContentSignal } of scored) {
      if (result.length >= TOP_N) break
      if (hasContentSignal) {
        result.push({ title: posts[j].title, path: posts[j].path, date: posts[j].date, category: posts[j].category, coverImage: posts[j].coverImage })
        used.add(j)
      }
    }

    // If content and tags do not provide enough candidates, prefer the same category.
    if (result.length < TOP_N && categories[i] !== '') {
      const categoryFallback = posts
        .map((post, j) => ({ post, j }))
        .filter(({ j }) => !used.has(j) && categories[j] === categories[i])
        .sort((a, b) => newestFirst(a.post, b.post))

      for (const { j } of categoryFallback) {
        if (result.length >= TOP_N) break
        result.push({ title: posts[j].title, path: posts[j].path, date: posts[j].date, category: posts[j].category, coverImage: posts[j].coverImage })
        used.add(j)
      }
    }

    // Use the newest posts only as a final fallback.
    if (result.length < TOP_N) {
      const recentPosts = posts
        .map((post, j) => ({ post, j }))
        .sort((a, b) => newestFirst(a.post, b.post))

      for (const { j } of recentPosts) {
        if (result.length >= TOP_N) break
        if (!used.has(j)) {
          result.push({ title: posts[j].title, path: posts[j].path, date: posts[j].date, category: posts[j].category, coverImage: posts[j].coverImage })
          used.add(j)
        }
      }
    }

    map[current.path] = result
  }

  return map
}

export function buildRelatedMap(event: H3Event): Promise<RelatedMap> {
  if (!cached) cached = compute(event)
  return cached
}
