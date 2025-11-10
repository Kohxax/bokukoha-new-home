<script setup lang="ts">
import { Avatar, AvatarFallback } from '~/components/ui/avatar'

</script>

<template>
  <div class="flex min-h-screen flex-col items-center bg-background px-4 py-16 text-foreground sm:py-24">

    <Avatar class="mb-12 h-50 w-50 shadow-xl" style="view-transition-name: main-avatar">
      <img src="~/assets/img/icon_glass.png" alt="Koha" />
      <AvatarFallback>KH</AvatarFallback>
    </Avatar>

    <main class="w-full max-w-2xl space-y-6" style="view-transition-name: about-content">

      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-bold tracking-tight">
            # 自己紹介
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-foreground">
          <p>名前: こは</p>
          <p>年齢: 21</p>
          <p>性別: 男</p>
          <p>趣味: PCゲーム, 散歩, 飲酒, 音楽, 旅行</p>
          <p>言語: JPN 〇 ENG △</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-bold tracking-tight">
            # ゲームと好きなキャラ
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-foreground">
          <p>崩壊スターレイル: 花火, ヘルタ, 景元, アベンチュリン</p>
          <p>崩壊3rd: ゼーレ, ブローニャ, エリシア</p>
          <p>PCゲー: Minecraft, MHWilds, Rocket League 等</p>
          <p>CS: どう森シリーズ, モンハンシリーズ</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-bold tracking-tight">
            # 音楽
          </CardTitle>
        </CardHeader>
        <CardContent class="text-foreground">
          <p>Aiobahn, rejectionみたいな電子音楽、エロゲ曲、アニソン、崩壊シリーズの劇中歌が好き。音楽の趣味が合う人はぜひ教えてください。</p>
          <p>音響機器もそこそこ好きです。A5000, ifi go barユーザー。</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-bold tracking-tight">
            # 自宅サーバー
          </CardTitle>
        </CardHeader>
        <CardContent class="text-foreground">
          <p>メルカリとかでパーツ拾って組んだPCにProxmox入れて遊んでます。CPUはi7-6700k, RAMは48GBです。色々とやりたいことはあるんですが、基本的にお金とストレージ不足；；</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-bold tracking-tight">
            # 適当
          </CardTitle>
        </CardHeader>
        <CardContent class="text-foreground">
          <p> ここまで読んでくださってありがとうございます。趣味あう人と話すのは楽しくて好きなので、気軽に話しかけてください。Discord含むゲームとかのフレ申請は知り合いなら通します！よろしくお願いします！ </p>
        </CardContent>
      </Card>

    </main>

    <footer class="mt-12">
      <NuxtLink to="/" class="text-sm text-muted-foreground hover:text-foreground">
        ← Home
      </NuxtLink>
    </footer>

  </div>
</template>
