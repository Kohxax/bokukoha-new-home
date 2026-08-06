<template>
  <div class="text-center py-16">
    <h1 class="text-3xl font-bold">ページが見つかりません。</h1>
    <p class="text-muted-foreground mt-4">
      お探しのページは削除されたか、URLが変更された可能性があります。
    </p>
    <Button as-child class="mt-6">
      <NuxtLink to="/">ホームに戻る</NuxtLink>
    </Button>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'ページが見つかりません',
})
</script>
