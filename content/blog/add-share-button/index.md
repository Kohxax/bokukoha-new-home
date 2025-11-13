---
title: 'Hugo + Stackのブログにシェアボタン実装した'
date: 2025-06-30
draft: 0
coverImage: '/images/blog/add-share-button/main.jpg'
category:
  - 技術系
tags:
  - Hugo
  - HTML
  - CSS
  - Stack Theme
---

## 概要

タイトル通りです。このブログはHugo製で、Stackというテーマを適用して作っています。Stackテーマは改造等割と自由なので、試しにシェアボタンを実装してみるかと思いやってみました。

HTMLとCSSの知識、あとはHugoに関するドキュメントを調べる能力があれば行けると思います。今後色々追加する自分向けの備忘録として、この記事では簡単にやり方を書きます。Stackテーマに限らず、Hugo製ページの構造を少し理解していれば、どのテーマでも同じように改造ができると思うので、よければ参考にしてください。

step by stepのような解説ではなくあくまでメモなので、コードが気になる方は[このブログのリポジトリ](https://github.com/Kohxax/bokukoha-hugo-blog)を見てみてください。

![完成形](/images/blog/add-share-button/1.jpg)

## 前提知識

Hugo、少なくともStackテーマでは、`./themes/layouts`内にウィジェットなど各種ページを構成するパーツがまとめて入れられていて、そのパーツを`./themes/layouts/_default/single.html`や`./themes/layouts/partials/article/article.html`なんかで読み込んで実際のページを作るという感じの動作をしています。

Hugoの公式ドキュメントによれば`./layouts`というディレクトリを作り、その中にthemes内と同じディレクトリ構造を作ってあげれば任意のパーツを上書きしたり、あるいは新しいパーツを追加して読み込むなんてことができるようになります。今回のシェアボタン追加は後者の方をやっていきます。

## やり方

`./layouts/partials`内に`social-share.html`というコンポーネントを作成します。

`social-share.html`内にボタンや文章など、シェアボタンの部分に必要なものをHTMLとCSSで書きます。HTMLやCSSの変更はページ更新ではなく、開発サーバーを再起動しないと適用されないので注意してください。

### HTMLの読み込み
作ったシェアボタンのコンポーネントを記事の方で読み込みます。

`./themes/layouts/partials/article/article.html`を`./layouts/partials/article/`内にコピーします。上書きする方の`article.html`内の任意の場所に

```
{{ partial "social-share.html" . }}
```
という行を追加してください。このブログではfooterの下に追加しています。

### アイコンの読み込み
シェアボタンのアイコン部分の読み込みですが、これは`./assets/icons/hoge.svg`を読み込むようにするものとしています。svgファイルは[stackが使っているサイト](https://tabler.io/icons)などのアイコン配布サイトから拾ってきてもらうとして、実際にどうやってHTML内で書いて表示させるのかについて簡単に書きます。

`./assets/hoge/hoge.svg`を読み込みたいときは、

```
{{ $hoge := resources.Get "hoge/hoge.svg"}}
{{ $hoge.Content | safeHTML }}
```

のように書いてあげるだけでOKです。これをaタグで囲ってあげればアイコンが表示されます。

### 調整
CSSで頑張っていい感じに調整します。CSSがわからなくても、geminiやchatGPTにコードとスクショを投げれば割といい感じにしてくれると思います。

分かりにくいのでいくとアイコンや文字の色の指定ですが、

```
var(--card-text-color-main);
var(--card-text-color-secondary);
```
のような色要素をテーマから拾ってこれるので、CSSで色指定する時はこれらを`color`のあとにつけてあげればいい感じになります。ダークテーマでもライトテーマでも、Hugoのテーマ本来の設定された色に基づいて色が変わってくれるので便利。

## おわり
やってることとしては、追加したいコンポーネント作って、それを読み込むように既存のページ構成ファイルを上書きするだけなのでそこまで難易度は高くないですが、如何せん情報が少ないのでそこそこ時間がかかりました。

ファイルパスなんかは基本的にこの記事に書いているので、前述の通りわからなくなったら[このブログのリポジトリ](https://github.com/Kohxax/bokukoha-hugo-blog)を見てみてください。多分わかると思います。

ではまた次回👋