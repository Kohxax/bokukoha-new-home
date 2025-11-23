---
title: 'MisskeyのDBバックアップとオブジェクトストレージの設定方法'
date: 2025-11-23
draft: 0
coverImage: '/images/blog/misskey-setting/main.jpg'
category:
  - 技術系
tags:
  - 備忘録
  - Misskey
  - Cloudflare
  - Docker
---

# 概要

サムネののどかな景色は一切関係ありません。最近 Misskey の自インスタンスへの完全移行を本格的に考え始めたので、後回しにしていた DB のバックアップとオブジェクトストレージの設定をしてきました。今回はその設定した内容なんかを、備忘録的な感じで書いていく記事になります。Misskey 自インスタンスを持っていない人はおそらくどうでもいい内容だと思うので、他の記事でも読んでくださればと。

DB バックアップ作成の手順、バックアップからの復旧手順、そしてオブジェクトストレージの設定方法という順番で並んでいるので、好きなところを読んでください。

# 前提

- Misskey を**Docker Compose**環境で構築していること
- Cloudflare でドメインを契約している / Cloudflare にドメインを登録している
- 今回のバックアップ対象は DB（PostgreSQL）のみであること（files などは対象外）
- ↑ に関連して、オブジェクトストレージを使用しているものとする
- 基本的な CLI の操作がわかり、コマンド入力等の知識があること

# DB のバックアップ

ステップバイステップで解説します。とはいっても特別難しいことはなく、やることは先人が作ってくれている`PostgreSQL`バックアップ用 Docker Image を引っ張ってきてコンテナを作るだけとなります。

#### ①Misskey とは別のディレクトリを用意する

misskey のあれこれが入っている`/misskey`の外で、以下を実行してバックアップのあれこれを格納するディレクトリを作ります。

```shell [bash]
mkdir misskey-backup
cd misskey-backup
```

#### ②compose.yml を作成してあれこれ設定する

中身のあれこれは下で解説するので、一旦コピペしてください。

```shell [bash]
nano compose.yml
```

そして以下を張り付ける。

```yml [compose.yml]
services:
  db-backup:
    image: prodrigestivill/postgres-backup-local
    restart: always
    networks:
      - misskey_internal_network # ※1
    volumes:
      - ./backups:/backups
    environment:
      - TZ=Asia/Tokyo # ※2
      - POSTGRES_HOST=db
      - POSTGRES_DB=misskey # ※3
      - POSTGRES_USER=misskey # ※3
      - POSTGRES_PASSWORD=MisskeyのDBパスワード # ※3

      # 毎日 午前4時00分 に実行
      - SCHEDULE=0 4 * * * # ※4
      - BACKUP_KEEP_DAYS=7
      - BACKUP_KEEP_WEEKS=4
      - BACKUP_KEEP_MONTHS=6

networks:
  misskey_internal_network:
    external: true
    name: misskey_internal_network # ※1
```

ここからは、上の`compose.yml`内の※がついている箇所について解説、変更していきます。※の箇所のみが変更する可能性のある中でも重要な場所なので一旦解説しますが、何が書いてあるのかわかる方や、「お前のことは信用できないから全部変更したい！」という方は AI に投げたら解説してくれると思います。

**※1** <br>
ここは、misskey 本体が動いている docker ネットワークの名前です。何も変更していなければ`misskey_internal_network`となっているので（misskey 2025.10 時点）基本的に変更は不要ですが、不安な方は以下のコマンドを`/misskey`内で実行してみてください。そこで得られたネットワーク名を※1 の箇所に入力してください。

```shell [bash]
docker network ls | grep internal
# xxxxxxxxxx misskey_internal_network bridge local のような出力が得られるはず。
```

**※2** <br>
ここはバックアップのスケジュールを設定する際に参照するタイムゾーンの設定です。日本以外に住んでいる人は変更する必要がありますが、そうでない方はそのままで OK です。

**※3** <br>
ここはバックアップ対象である`PostgreSQL`の DB の DB 名, ユーザー名, パスワードを設定する部分です。初期設定では全て misskey となっていますが変更している人もいると思うので解説します。これらの情報は`/misskey/.config/docker.env`に書かれているので、ここを参照してあげれば OK です。以下は`/misskey`内から内容を確認するためのコマンドです。

```shell [bash]
cat .config/docker.env
# POSTGRES_PASSWORD=xxxxx など複数要素の出力が得られるはず。
```

**※4** <br>
バックアップを取る頻度を指定できます。デフォルトでは毎日午前 4 時に設定していますが、変更したい人は[この記事](https://qiita.com/nemutas/items/3f5816eabbf0eda5e6a9)なんかを参考にして cron 形式の時間指定を書き換えてください。

#### ③ 起動

ここまで出来たらあとはコンテナを起動してあげるだけです。以下のコマンドを先ほど作成した`compose.yml`があるのと同じディレクトリで実行してコンテナの起動を確認してください。

```shell [bash]
docker compose up -d
```

コンテナがちゃんと動くか不安な方は以下のコマンドを同じディレクトリで実行してあげれば手動でバックアップを作成することができます。

```shell [bash]
docker compose exec db-backup /backup.sh
```

`backups/`にバックアップが作成されているはずです。

# DB の復旧方法

オブジェクトストレージに関する手順はこの項の次にあるので、復旧方法は今はいらないという方はこの部分だけコピペして保存して次の項までスクロールしてください。

#### ① Misskey 自体の動作を止め、既存 DB を削除し空の DB を起動する

`/misskey`内で実行してください。

```shell [bash]
docker compose down

rm -rf ./db

docker compose up -d db
```

#### ② バックアップから復旧させる

`backups`があるディレクトリ（バックアップコンテナ用の compose.yml があるのと同じ階層）で実行してください。先ほど起動した DB はそのままにしてください。起動している状態でリストアをします。

```shell [bash]
ls -lh backups/ # 戻したい地点のファイル名を確認してください(misskey-20251123.sql.gzなど)

docker compose exec db-backup /restore.sh /backups/戻したいファイル名.sql.gz
```

#### ③Misskey を再起動する

`/misskey`内で実行してください。

```shell [bash]
docker compose up -d
```

以上で DB の復旧作業は完了です。

# オブジェクトストレージの設定（Cloudflare R2）

ここからは Cloudflare R2 オブジェクトストレージの設定をかるーく書きます。一応注意点として、R2 は無料枠がそこそこデカいです。容量としては 10GB まで、アップロードやアクセスなんかの操作にも一応制限はあるのですが、少数人数のサーバーではまず到達することができないレベルの数字なので具体的には解説しませんが、そういうレベルで無料枠がデカいという話です。容量はある程度長く使えば超える可能性がありますが、50GB くらいになっても月額が 100 円を超えることはないので安心して使えると思います。

#### Cloudflare R2 のダッシュボードにアクセスしてバケット作成

![ストレージとデータベースからR2ページにアクセス](/images/blog/misskey-setting/1.png)

![バケットを作成](/images/blog/misskey-setting/2.png)

バケット名は任意、位置情報は自動、デフォルトのストレージクラスは`Standard`に設定してください。

#### 色々設定

バケット作成をできたらバケット内の「設定」タブに移動してください。

![これ](/images/blog/misskey-setting/3.png)

色々と設定項目がありますが、ここではカスタムドメイン以外設定する必要はありませんので、カスタムドメイン追加方法だけ解説します。

カスタムドメインタブの追加をクリックし、ドメインに自分が設定したいものを入力してあげます。ここで設定したものが misskey 側からファイルにアクセスする際に使われます。`example.com`が自身のドメインなら、`r2.example.com`や`db.example.com`なんかでいいでしょう。既にあるものと被らなければ何でも OK です。特に追加設定はいらず、クリックで進めてあげるだけで Cloudflare が DNS に登録してくれます。このドメインはメモしておいてください。

#### アクセストークン設定

最初にアクセスした R2 のダッシュボードに戻ってください。PC 表示にはなりますが、右側らへんに`Account Details`というテーブルが目に入ると思います。そこにある`Api Tokens`のとなりにある`{} Manage`をクリックしてアクセストークンの管理画面に移動して設定していきます。

![これ](/images/blog/misskey-setting/4.png)

移動したら、アカウント API トークンを作成します。トークン名は任意、アクセス許可は「オブジェクト読み取りと書きこみ」、バケット指定から先ほど作成したバケットを選択してください。他はデフォルト、空欄のままで OK です。

作成ボタンを押下すると色々とトークンが並んでる画面に遷移すると思いますが、ここでメモが必要なのは**アクセスキー ID**, **シークレットアクセスキー**, **S3 クライアント用エンドポイント**です。（エンドポイントは xxxx123456.r2.cloudflarestorage.com みたいな URL）

#### Misskey 側の設定

コントロールパネルからオブジェクトストレージの使用をオンにしたら、以下の画像のように設定してください。

![](/images/blog/misskey-setting/5.png)

![](/images/blog/misskey-setting/6.png)

BaseURL が少しわかりにくいですが、仮にカスタムドメインが`r2.example.com`、バケット名が`misskey`の場合は`r2.example.com/misskey`のようになります。(もちろん先頭に https:// をいれてください。)

ここまできたらあとは画像を新しくアップロードして表示されるか確認するだけです。お疲れさまでした。

少なくとも misskey 2025.10 まではこの方法でオブジェクトストレージが使えます。まあオブジェクトストレージ周りで Misskey 側でとんでもない変更が来ることはないと思うので、後から読む人が困るのはおそらく Cloudflare 側の表示が変わっていることなんじゃないかなと思います。AI を使えばなんとかなると思うので頑張ってください。

#### 仮に画像が表示されない場合の対処法

最初これで少し詰まったので書いておきます。前述の通りに設定すれば問題なく表示されるはずですが、仮に表示されなかった場合以下の手順で解決できる可能性があります。

1. 画像を添付してノートを作成し、添付画像がぼやけて表示されていないことを確認
2. Cloudflare R2 のバケット内を確認し、画像がアップロードされているか確認（されていない場合、Misskey 側の設定で抜けがないか、キーなどが間違っていないか確認）
3. アップロードされている画像のオブジェクト名をクリックし、URL を確認（r2.example.com/misskey/123456abc.webp など）
4. 投稿したノートに添付されているぼやけた画像を新規タブで開き、URL を確認（r2.example.com/123456abc.webp など）
5. 3 と 4 に相違がないか、もし相違があった場合は misskey 側の設定で BaseURL を cloudflare 側のものに合わせて設定する（この例では misskey 側 URL で r2.example のあとにバケット名が抜けている）

# おわり

長丁場ですがお疲れさまでした！自分用のメモ的な感じで書くつもりが、気付けばそこそこしっかりと書いてしまいました。自インスタンスを建てて、misskey サーバー主の仲間入りをした方なんかはぜひやってみてください。

この記事が参考になった方は、SNS でのシェア、あるいは下のいいねボタンを押してくれると僕が喜びます！では、また次回 👋
