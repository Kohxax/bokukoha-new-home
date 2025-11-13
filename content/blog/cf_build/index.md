---
title: 'HugoでのCloudflare Pagesのビルド失敗を回避する方法'
date: 2025-05-11
draft: 0
coverImage: '/images/blog/cf_build/main.jpg'
category:
  - 技術系
tags:
  - 備忘録
  - Cloudflare
  - Hugo
---

## 概要

以前の記事で書きましたが、このブログサイトはCloudflare Pagesでビルドとデプロイをしています。Cloudflare Pagesくんは、とても便利ではあるのですが、ページ内のコンテンツ（主に画像）が増えてビルドが30秒以内に終わらなくなると、`Error: error building site: render: failed to render pages`, `partial "head/head.html" timed out after 30s. This is most likely due to infinite recursion.`などの文言と共にビルドが失敗するようになります。

![ビルドに30秒以上かかって失敗している](/images/blog/cf_build/error.jpg)

このままでは困るので、Hugo製のサイトならどのテーマでも使える解決方法でサクっと解決します。

## 方法
Hugoプロジェクトディレクトリにある`config.yaml`や`hugo.toml`など、任意のconfigファイルがあると思います。
yamlやtomlの書き方に従って、ファイル内に

```
timeout: 120s
```

といった記述を追加してあげるだけでOKです。何も記述していないとtimeoutはデフォルトの30秒が適用されます。ここでは一時的に2分にしてますが、もっとビルドに時間がかかるようなら伸ばしてあげてください。

<details>
<summary>例: このブログのconfig.yaml（github参照）</summary>

```
baseurl: https://blog.bokukoha.dev/
languageCode: ja
theme: hugo-theme-stack
title: こは雑記帳
copyright: Koha
timeout: 120s
```
</details>