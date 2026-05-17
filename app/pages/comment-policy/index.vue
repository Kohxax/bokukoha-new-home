<script setup lang="ts">
useSeoMeta({
  title: 'コメントポリシー',
  ogDescription: 'ぼくこは.dev のコメント欄に関するポリシーです。',
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <main class="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 class="text-2xl font-bold tracking-tight mb-10">コメントポリシー</h1>

      <section class="policy-section">
        <h2 class="section-heading">収集する情報</h2>
        <p class="text-sm leading-relaxed text-muted-foreground">
          コメント投稿時に、入力された名前・メールアドレス・本文、および送信元 IP アドレスを収集します。
          メールアドレスと IP アドレスはハッシュ化して保存し、そのまま記録・公開されることはありません。
          名前・本文は公開されます。
        </p>
      </section>

      <section class="policy-section">
        <h2 class="section-heading">利用目的</h2>
        <ul class="text-sm leading-relaxed text-muted-foreground list-disc list-inside space-y-1">
          <li>コメントの表示</li>
          <li>スパム・荒らし行為の検出・防止</li>
          <li>同一人物によるコメントの識別（ハッシュ化した値のみ使用）</li>
        </ul>
      </section>

      <section class="policy-section">
        <h2 class="section-heading">削除するコメント</h2>
        <ul class="text-sm leading-relaxed text-muted-foreground list-disc list-inside space-y-1">
          <li>スパム・宣伝目的と判断されるもの</li>
          <li>特定の個人・団体への誹謗中傷</li>
          <li>差別的・暴力的な表現を含むもの</li>
          <li>その他、管理者が不適切と判断したもの</li>
        </ul>
        <p class="text-sm leading-relaxed text-muted-foreground mt-3">
          投稿されたコメントは自動モデレーションを経て公開されます。削除基準に該当する場合は予告なく非表示にすることがあります。
        </p>
      </section>

      <section class="policy-section border-b-0! pb-0!">
        <h2 class="section-heading">お問い合わせ</h2>
        <p class="text-sm leading-relaxed text-muted-foreground">
          コメントの削除依頼などは
          <a href="https://misskey.io/@koharen" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 hover:text-foreground transition-colors">Misskey</a>
          または
          <a href="https://x.com/Kohxax" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 hover:text-foreground transition-colors">X (Twitter)</a>
          からご連絡ください。
        </p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.policy-section {
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.section-heading {
  margin-bottom: 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}
</style>
