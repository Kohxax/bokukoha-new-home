---
title: 'Hugo + Stackテーマで楽に作る個人ブログ'
date: 2025-02-20
draft: 0
coverImage: '/images/blog/hugo-blog/main.jpg'
category:
  - 技術系
tags:
  - Hugo
  - Stack Theme
  - Cloudflare
  - Go
  - DartSass
  - Git
---

## はじめに
この記事では弊ブログサイトを作るにあたって参考にした記事や公式ドキュメントを紹介する。誰でもわかりやすいような解説を目指すが、あくまでも備忘録であるため個別の質問等には応じられない可能性がある。

jimmy氏作のStack themeを使用してブログページを作り、windows11のVisual Studio Codeからgithubのレポジトリにcommit&push、そしてcloudflare pagesでビルドとデプロイをすること目標としているものと想定して解説をする。

また、完成形はStack themeの[デモページ](https://demo.stack.jimmycai.com/)を目指すものとする。

![こんな感じ](/images/blog/hugo-blog/kansei.jpg)

### 追記 : ブログのカスタムとか

この記事の手順自体には問題はないのですが、完成形としている「こは雑記帳」は一部カスタムしています（シェアボタンの追加、いいねボタンの追加など）。カスタムの簡単な解説は別ページで解説しているので、よければそちらも読んでみてください。

[Hugo + Stackのブログにシェアボタン実装した](https://blog.bokukoha.dev/p/hugo--stack%E3%81%AE%E3%83%96%E3%83%AD%E3%82%B0%E3%81%AB%E3%82%B7%E3%82%A7%E3%82%A2%E3%83%9C%E3%82%BF%E3%83%B3%E5%AE%9F%E8%A3%85%E3%81%97%E3%81%9F/)

## 筆者の環境
・Cloudflareでドメイン取得済み <br>
・メインPCのOSはWindows11 <br>
・Cloudflareの各種サービスはある程度の利用経験あり <br>
・Linux及びWindowsの最低限のコマンド知識はあり（ディレクトリ移動やnano、touchなど）<br>
・Gitの最低限の使用方法がわかる

## 開発環境

**結論 : Windows使ってるならWindowsで作ろう**

当初は自鯖でホスティングしようと思っていたため、Proxmox上にLXCを建てて開発環境を作った。しかし、結局Cloudflare Pagesを利用したため、開発環境はWindows11（x64）で作るものとする。 <br>
Cloudflare Pagesを使わずにgithubのwebhookを使ってビルドとデプロイを自動化するスクリプト書こうと思えるなら話は違うけど、楽に作るならcloudflare pagesがオススメ。

## Hugoのインストール
基本的にHugoの[Windows用公式Doc](https://gohugo.io/installation/windows/)に沿って書くだけなので、これが読めてわかる人は読み飛ばしてもらっても問題ないかも。

### 前提条件

Hugoをインストールする前に、いくつか必要になるものがあるためそれらをインストールする。

#### gitのインストール
①まずgitの[ダウンロードページ](https://git-scm.com/downloads)にアクセスする。

②**Windows**を選択する

![](/images/blog/hugo-blog/git-ins1.jpg)

③**64-bit Git for Windows Setup**を選択する。

![](/images/blog/hugo-blog/git-ins2.jpg)

④ダウンロードされた`Git-x.xx.x-64-bit.exe`を起動し、gitをインストールする。

⑤windowsのコンソールで
```
git --version
```

と入力し、`git version x.xx.x`の様な出力が得られればOK。

#### Goのインストール

①Goのインストーラー[ダウンロードページ](https://go.dev/dl/)にアクセスする。

②Stable versionsリスト内から`gox.xx.x.windows-amd64.msi`を探してダウンロードする。

![](/images/blog/hugo-blog/go-ins1.jpg)

③ダウンロードしたインストーラーを起動し、Goをインストールする。

④Gitと同様にWindowsのコンソールで
```
go version
```

と入力し、`go version gox.xx.x windows/amd64`の様な出力が得られればOK。

#### Dart Sassのインストール

①Dart Sassの[公式GitHubリリースページ](https://github.com/sass/dart-sass/releases)にアクセスする。

②最新バージョンのリリースからWindows用のzipファイル（例`dart-sass-1.85.0-windows-x64.zip`）を探してダウンロードする。

![](/images/blog/hugo-blog/dartsass-ins1.jpg)

③ダウンロードしたzipファイルを解凍し、中身の`dart-sass`フォルダをわかりやすい場所（例 Cドライブ直下等）に配置する。

③Windowsの検索メニューから**環境変数を編集**のウィンドウを開く。

④ウィンドウ内のユーザー環境変数 or システム環境変数から`Path`を選択し**編集**をクリックする。

![](/images/blog/hugo-blog/dartsass-ins2.jpg)

⑤**新規**をクリックし、入力を求められている部分に②で配置したdart-sassフォルダのパスを入力する。（例 Cドライブ直下に配置していた場合は、`C:\dart-sass`）

⑥前述の2つと同様に、Windowsのコンソールで
```
sass --version
```

と入力しｍ`x.xx.x`の様な出力が得られればOK。

### Hugo本体のインストール

前述の前提条件が全て揃っていることが確認出来たら、いよいよHugo本体をインストールする。

とはいってもこれは簡単で、Windowsのコンソールで
```
winget install Hugo.Hugo.Extended
```
と入力するだけでOK。特に問題が無ければ無事インストールが完了するはず。

インストール終了後は、前提条件同様にコンソールで

```
hugo version
```
と入力し、出力が得られることを確認することを忘れずに。

#### 注意事項

前項で得られたバージョン出力が`0.123.0`より大きい数字であることを必ず確認すること。`0.123.0`はこの後導入するStackテーマが動作する最低バージョンであるため、これが小さい数字になっているとテーマがうまく動作しなくなる。

## Hugoでプロジェクト作成
ブログを作りたいディレクトリ内（例 Cドライブ直下）でコンソールで

```
hugo new site your_blog_name
```

と入力する。すると`C\:your_blog_name`というHugoのプロジェクトフォルダが作成される。`your_blog_name`は任意の名前に変えること。

## テーマ追加

Hugoのプロジェクトフォルダが作られたら、今回使用する[Stackというtheme](https://github.com/CaiJimmy/hugo-theme-stack)を追加する。

```
cd your_blog_name
git init
git submodule add https://github.com/CaiJimmy/hugo-theme-stack/ themes/hugo-theme-stack
```

それぞれのコマンドを実行することでthemeのフォルダが追加できる。

---

次に、デモサイトのコンフィグ情報をそのまま`your_blog_name`に適用する。
rootディレクトリの`hugo.toml`を削除し、新たに`config.yaml`を作成しVScodeなどで開く。　

その中身に[デモサイトconfig](https://github.com/CaiJimmy/hugo-theme-stack/blob/master/exampleSite/hugo.yaml)の中身を全部貼り付けるだけでOK。

<details>
<summary>弊blogで使っているconfig.yml | これをコピペしてもOK（SNSリンク欄、タイトル等の基本情報、footer情報、コメントセクションのオンオフを変更している）</summary>

```
baseurl: https://your_blog_url/
languageCode: ja
theme: hugo-theme-stack
title: your_blog_name
copyright: your_name

# Theme i18n support
# Available values: ar, bn, ca, de, el, en, es, fr, hu, id, it, ja, ko, nl, pt-br, th, uk, zh-cn, zh-hk, zh-tw
DefaultContentLanguage: en

# Set hasCJKLanguage to true if DefaultContentLanguage is in [zh-cn ja ko]
# This will make .Summary and .WordCount behave correctly for CJK languages.
hasCJKLanguage: true

pagination:
    pagerSize: 3

permalinks:
    post: /p/:slug/
    page: /:slug/

params:
    mainSections:
        - post
    featuredImageField: image
    rssFullContent: true
    favicon: # e.g.: favicon placed in `static/favicon.ico` of your site folder, then set this field to `/favicon.ico` (`/` is necessary)

    footer:
        since: 9999
        customText:

    dateFormat:
        published: Jan 02, 2006
        lastUpdated: Jan 02, 2006 15:04 MST

    sidebar:
        emoji:
        subtitle: A Japanese student.
        avatar:
            enabled: true
            local: true
            src: img/avatar.png

    article:
        math: false
        toc: true
        readingTime: true
        license:
            enabled: true
            default: Licensed under CC BY-NC-SA 4.0

    comments:
        enabled: false
        provider: disqus

        disqusjs:
            shortname:
            apiUrl:
            apiKey:
            admin:
            adminLabel:

        utterances:
            repo:
            issueTerm: pathname
            label:

        beaudar:
            repo:
            issueTerm: pathname
            label:
            theme:

        remark42:
            host:
            site:
            locale:

        vssue:
            platform:
            owner:
            repo:
            clientId:
            clientSecret:
            autoCreateIssue: false

        # Waline client configuration see: https://waline.js.org/en/reference/component.html
        waline:
            serverURL:
            lang:
            pageview:
            emoji:
                - https://unpkg.com/@waline/emojis@1.0.1/weibo
            requiredMeta:
                - name
                - email
                - url
            locale:
                admin: Admin
                placeholder:

        twikoo:
            envId:
            region:
            path:
            lang:

        # See https://cactus.chat/docs/reference/web-client/#configuration for description of the various options
        cactus:
            defaultHomeserverUrl: "https://matrix.cactus.chat:8448"
            serverName: "cactus.chat"
            siteName: "" # You must insert a unique identifier here matching the one you registered (See https://cactus.chat/docs/getting-started/quick-start/#register-your-site)

        giscus:
            repo:
            repoID:
            category:
            categoryID:
            mapping:
            lightTheme:
            darkTheme:
            reactionsEnabled: 1
            emitMetadata: 0

        gitalk:
            owner:
            admin:
            repo:
            clientID:
            clientSecret:
            proxy:

        cusdis:
            host:
            id:
    widgets:
        homepage:
            - type: search
            - type: archives
              params:
                  limit: 5
            - type: categories
              params:
                  limit: 10
            - type: tag-cloud
              params:
                  limit: 10
        page:
            - type: toc

    opengraph:
        twitter:
            # Your Twitter username
            site:

            # Available values: summary, summary_large_image
            card: summary_large_image

    defaultImage:
        opengraph:
            enabled: false
            local: false
            src:

    colorScheme:
        # Display toggle
        toggle: true

        # Available values: auto, light, dark
        default: auto

    imageProcessing:
        cover:
            enabled: true
        content:
            enabled: true

### Custom menu
### See https://stack.jimmycai.com/config/menu
### To remove about, archive and search page menu item, remove `menu` field from their FrontMatter
menu:
    main: []

    social:
        - identifier: github
          name: GitHub
          url: https://github.com/
          params:
              icon: brand-github

        - identifier: twitter
          name: Twitter
          url: https://x.com/
          params:
              icon: brand-twitter
        
        - identifier: misskey
          name: Misskey
          url: https://misskey.io/
          params:
              icon: misskey

related:
    includeNewer: true
    threshold: 60
    toLower: false
    indices:
        - name: tags
          weight: 100

        - name: categories
          weight: 200

markup:
    goldmark:
        extensions:
            passthrough:
                enable: true
                delimiters:
                    block:
                        - - \[
                          - \]
                        - - $$
                          - $$
                    inline:
                        - - \(
                          - \)
        renderer:
            ## Set to true if you have HTML content inside Markdown
            unsafe: true
    tableOfContents:
        endLevel: 4
        ordered: true
        startLevel: 2
    highlight:
        noClasses: false
        codeFences: true
        guessSyntax: true
        lineNoStart: 1
        lineNos: true
        lineNumbersInTable: true
        tabWidth: 4
```
</details>

---

`config.yaml`を無事に作成出来たら、次はいよいよ開発用サーバーを起動する。

```
hugo server -D
```

上記のコマンドをプロジェクトのrootディレクトリで実行することで`localhost:1313`に開発サーバーを起動できる。
`-D`は下書きのポストも一覧に表示するためのオプションである。

お使いのブラウザで`localhost:1313`にアクセスし、テーマがきちんと適用されていることを確認しよう。

<small>※筆者は`-D`を起動オプションに入れずにサーバーを起動し、下書きポストが表示されず10分ほど無駄なトラブルシューティングをすることになったため、上記の通り実行することを推奨。</small>

## 投稿作成
テスト用の投稿を以下コマンドで作成することができる。

```
hugo new content post/Hello-World/index.md
```

`localhost:1313`で記事が作成されていることが確認できるはず。
`index.md`を編集し保存することでリアルタイムで記事の編集とプレビューができるのでとっても便利。

### 投稿のテンプレート作成

毎回`index.md`内でタイトルとかタグとか書くのは面倒なので、テンプレートを作成する。

`./archetypes/default.md`を作成し、中身を以下の様な感じにする。

```
---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
date: {{ .Date }}
draft: true
image: 'main.jpg'
categories:
  - カテゴリ
tags:
  - タグ
---

## 記事
```

これで、以降新しいページを

```
hugo new content post/post_name/index.md
```

で作ったときに、タイトルは`post_name`、日時は作った時刻、ポストのメイン画像は`post_name/main.jpg`を参照してくれるようになる。

カテゴリやタグは変更すること。また、公開する時には`draft:true`を`false`に変えることを忘れずに。

## デフォルトからのカスタマイズ

Demoサイトと同じものにするために少しカスタマイズをする。必要ないと思う機能がある場合は飛ばして問題ないものもある。

### 左のアバター画像の追加

![これ](/images/blog/hugo-blog/avatar.jpg)

解像度が150x150の画像を用意したら`assets/img`にavatar.jpgという名前で突っ込んであげるだけでOK。最初はimgディレクトリはないので、自分で作って上げるとよい。

### About・Archives・Searchの追加

それぞれthemeに機能として備わっているので、ページだけ追加してあげればOK。

<details>
<summary>丸パクリでOK</summary>

- content/about/index.md

```
---
title: About
aliases:
  - contact
menu:
    main: 
        weight: -90
        params:
            icon: user
---

## 自己紹介

ここに自己紹介
```

- content/archives/index.md

```
---
title: "Archives"
date: 2019-05-28
layout: "archives"
slug: "archives"
menu:
    main:
        weight: -70
        params: 
            icon: archives
---
```

- content/search/index.md

```
---
title: "Search"
slug: "search"
layout: "search"
outputs:
    - html
    - json
menu:
    main:
        weight: -60
        params: 
            icon: search
---
```

</details>

### 日本語フォントに対応させる

どうやらデフォルトだと中華フォントらしいので日本語に変える。

`assets`内に`scss`ディレクトリを作り、その中に`custom.scss`を作って以下の内容をコピペする。フォントは各自好きなものを使っても大丈夫。

```
:root {
  --sys-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Droid Sans", "Helvetica Neue";
  --ja-font-family: "游ゴシック体", "Yu Gothic", YuGothic, "ヒラギノ角ゴ Pro", "Hiragino Kaku Gothic Pro", "メイリオ", "Meiryo";
  --base-font-family: "Lato", var(--sys-font-family), var(--ja-font-family), sans-serif;
  --code-font-family: Menlo, Monaco, Consolas, "Courier New", var(--ja-font-family), monospace;
}
```

### サイトのアイコン（favicon）を変更

![これ](/images/blog/hugo-blog/tab.jpg)

faviconの作成方法については「favicon 作成方法」とでもググればいくらでも解説が出てくるのでここでは割愛する。

favicon.icoを`static`ディレクトリ内に入れてあげれば適用される。

### .gitignoreの設定

[hugo用のgitignore設定](https://github.com/github/gitignore/blob/main/community/Golang/Hugo.gitignore)があるので、これをそのまま使う。

rootディレクトリに`.gitignore`を作成し、中身を以下にすればOK。

```
# Generated files by hugo
/public/
/resources/_gen/
/assets/jsconfig.json
hugo_stats.json

# Executable may be added to repository
hugo.exe
hugo.darwin
hugo.linux

# Temporary lock file while building
/.hugo_build.lock
```

## Cloudflare Pagesでの設定
Cloudflare Pagesのあれこれをする前に、`your_blog_name`のgitリポジトリを作成し、commitやpushはしておくこと。

ググってもよくわからん人は[chatGPT](https://chatgpt.com/)に状況をそのまま投げたら大体教えてくれるはず。

①Cloudflareのダッシュボード(<https://dash.cloudflare.com/>)にアクセスする。

②左側のタブから「コンピューティング」を探し、その中の「Workers&Pages」をクリックする。

![](/images/blog/hugo-blog/pages1.jpg)

③「作成」をクリックして「Pages」を選択する。

![こういう画面になるはず](/images/blog/hugo-blog/pages2.jpg)

③自分のGithubに接続し、`your_blog_name`のリポジトリを選択したら「セットアップの開始」を選択する。

④ビルドの設定では「フレームワークプリセット」で`Hugo`を選択する。

![](/images/blog/hugo-blog/pages3.jpg)

⑤下の方にある「環境変数（アドバンスド）」を展開し、「変数を追加する」をクリック。

`VARIABLE_NAME`は`HUGO_VERSION`・`値`は

```
hugo version
```

で得られた`hugo v0.144.1-a79d63a44659b6bc76dcdf223de1637e0bd70ff6+extended windows/amd64 BuildDate=2025-02-18T12:14:07Z VendorInfo=gohugoio`なら`0.144.1`にする。

⑥「保存してデプロイする」をクリックするとページのビルドが始まるはず。

⑦ビルドが無事成功したら、「カスタムドメイン」から自分のドメインと適当なサブドメイン（`blog.your.domain`とか）を決めて完成。

ドメインにアクセスして内容が表示されるまでに少し時間がかかる場合があるので、焦らず待つこと。

これでgitのリポジトリにpushすることでCloudflare pagesが自動でデプロイする環境が整った。

## 終わりに
日本語解説ないだろと思って頑張って公式Doc読んでブログ作ったんですが、後から調べてみたら普通に[あった](https://zenn.dev/seita1996/articles/hugo-markdown-blog)んですよね。

この記事は先駆者兄貴と環境が違っていたりCloudflare Pagesで自分が詰まったところを追加しただけの内容なので、わかりにくかったら先駆者兄貴のも併せて見てみてください。
