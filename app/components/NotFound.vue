<template>
  <div class="text-center py-16">
    <h1 class="text-3xl font-bold">ページが見つかりません。</h1>
    <p class="text-muted-foreground mt-4">
      お探しのページは削除されたか、URLが変更された可能性があります。
    </p>
    <NuxtLink to="/">
      <Button class="mt-6">ホームに戻る</Button>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
useHead({
    title: 'ページが見つかりません'
})
</script>