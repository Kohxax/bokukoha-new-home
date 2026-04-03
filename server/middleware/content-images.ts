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

const CONTENT_PREFIXES = ['/blog/', '/work/']

export default defineEventHandler(async (event) => {
  const url = event.path

  if (!CONTENT_PREFIXES.some((p) => url.startsWith(p))) return

  const ext = extname(url).toLowerCase()
  const mimeType = IMAGE_EXTS[ext]
  if (!mimeType) return

  const filePath = join(process.cwd(), 'content', url)
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
