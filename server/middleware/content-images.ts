import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { setResponseHeader, setResponseStatus } from 'h3'

const IMAGE_EXTS: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
}

// /images/blog/<slug>/file.jpg → content/blog/<slug>/file.jpg
// /images/work/<slug>/file.jpg → content/work/<slug>/file.jpg
const CONTENT_PREFIXES = ['/images/blog/', '/images/work/']

export default defineEventHandler(async (event) => {
  const url = event.path

  if (!CONTENT_PREFIXES.some((p) => url.startsWith(p))) return

  const ext = extname(url).toLowerCase()
  const mimeType = IMAGE_EXTS[ext]
  if (!mimeType) return

  // Strip leading /images to get content-relative path
  const contentRelative = url.replace(/^\/images\//, '/')
  const filePath = join(process.cwd(), 'content', contentRelative)
  try {
    const file = await readFile(filePath)
    setResponseHeader(event, 'Content-Type', mimeType)
    setResponseHeader(event, 'Cache-Control', 'no-store')
    setResponseStatus(event, 200)
    return file
  } catch {
    // file not found in content/, fall through to normal handling
  }
})
