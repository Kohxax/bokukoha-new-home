import fs from 'fs'
import path from 'path'

const name = process.argv[2]
if (!name) {
  console.error('Usage: node scripts/create-post.mjs <slug>')
  process.exit(1)
}

const root = process.cwd()

const postDir = path.join(root, 'content/blog', name)
const mdFile = path.join(postDir, 'index.md')
const imageDir = path.join(root, 'public/images/blog', name)

const template = `---
title: "${name}"
date: ${new Date().toISOString().split('T')[0]}
draft: 1
coverImage: "/images/blog/${name}/main.png"
category: 
  - 雑記
tags:
  - 
description: 
---

title
`

fs.mkdirSync(postDir, { recursive: true })
fs.mkdirSync(imageDir, { recursive: true })

fs.writeFileSync(mdFile, template)

console.log(`✨ 新しいブログ記事を作成しました！`)
console.log(`📝 ${mdFile}`)
console.log(`🖼 画像フォルダ: ${imageDir}`)
