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
  sim: number
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

  // CJK characters: bigram
  const cjkRe = /[　-鿿豈-﫿︰-﹏＀-￯]/g
  const cjkChars = clean.match(cjkRe) ?? []
  for (let i = 0; i < cjkChars.length - 1; i++) {
    tokens.push(cjkChars[i] + cjkChars[i + 1])
  }
  for (const ch of cjkChars) {
    tokens.push(ch)
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

async function compute(event: H3Event): Promise<RelatedMap> {
  const posts = await queryCollection(event, 'blog')
    .where('draft', '=', '0')
    .select('title', 'path', 'date', 'category', 'coverImage', 'tags', 'body')
    .order('date', 'DESC')
    .all() as PostRow[]

  const tokensList: string[][] = posts.map((p: PostRow) => {
    const titleTokens = tokenize(p.title)
    const bodyTokens = tokenize(extractText(p.body))
    const catTokens = tokenize(p.category ?? '')
    const tagTokens = (p.tags ?? []).flatMap((t: string) => tokenize(t))
    // title × 3 for weight boost
    return [...titleTokens, ...titleTokens, ...titleTokens, ...bodyTokens, ...catTokens, ...tagTokens]
  })

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
      .map((_p: PostRow, j: number) => ({ j, sim: j === i ? -1 : cosineSim(vectors[i], vectors[j]) }))
      .filter(({ j }: ScoredEntry) => j !== i)
      .sort((a: ScoredEntry, b: ScoredEntry) => {
        if (b.sim !== a.sim) return b.sim - a.sim
        return posts[a.j].date < posts[b.j].date ? 1 : -1
      })

    const result: RelatedPost[] = []
    const used = new Set<number>([i])

    for (const { j, sim } of scored) {
      if (result.length >= TOP_N) break
      if (sim > 0) {
        result.push({ title: posts[j].title, path: posts[j].path, date: posts[j].date, category: posts[j].category, coverImage: posts[j].coverImage })
        used.add(j)
      }
    }

    // Fill remaining with most recent posts
    if (result.length < TOP_N) {
      for (let j = 0; j < posts.length && result.length < TOP_N; j++) {
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
