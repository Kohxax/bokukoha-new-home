export function resolveCoverImage(coverImage: string | undefined | null, articlePath: string): string | undefined {
  if (!coverImage) return undefined
  if (coverImage.startsWith('/') || /^https?:\/\//.test(coverImage)) return coverImage
  const base = articlePath.endsWith('/') ? articlePath : articlePath + '/'
  return base + coverImage
}
