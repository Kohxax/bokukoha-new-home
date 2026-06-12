const URL_REGEX = /https?:\/\/[^\s<>"']+/g
const TRAILING_PUNCTUATION = /[)\]}>.,!?;:'"。、！？」』）】]+$/

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

// 本文中のURLをエスケープしつつ <a> リンクに変換する
export const linkifyText = (text: string): string => {
  let result = ''
  let lastIndex = 0

  for (const match of text.matchAll(URL_REGEX)) {
    const index = match.index ?? 0
    let url = match[0]

    const trailing = url.match(TRAILING_PUNCTUATION)
    if (trailing) url = url.slice(0, -trailing[0].length)
    if (!url) continue

    result += escapeHtml(text.slice(lastIndex, index))
    const escapedUrl = escapeHtml(url)
    result += `<a href="${escapedUrl}" target="_blank" rel="noopener noreferrer nofollow" class="underline break-all text-primary">${escapedUrl}</a>`
    lastIndex = index + url.length
  }

  result += escapeHtml(text.slice(lastIndex))
  return result
}
