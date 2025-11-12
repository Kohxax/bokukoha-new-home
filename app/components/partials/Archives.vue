<script setup>
import { Archive, LucideHash } from "lucide-vue-next"

const { data: posts } = await useAsyncData("all-posts", () =>
  queryCollection("blog")
    .select("title", "category", "date")
    .order("date", "DESC")
    .all()
)

const archivesByYear = computed(() => {
  const map = {}
  posts.value?.forEach((p) => {
    const y = new Date(p.date).getFullYear()
    if (!map[y]) map[y] = 0
    map[y]++
  })
  
  return Object.entries(map).sort((a,b) => Number(b[0]) - Number(a[0])).map(([year, count]) => ({ year, count }))
})

const archivesByCategory = computed(() => {
  const map = {}
  posts.value?.forEach((p) => {
    if (!map[p.category]) map[p.category] = 0
    map[p.category]++
  })
  return map
})
</script>

<template>
  <aside class="space-y-8 text-base">
    <div>
      <div class="flex items-center gap-2 mb-2">
        <Archive class="h-4 w-4 text-muted-foreground" />
        <h3 class="text-base font-semibold">アーカイブ</h3>
      </div>

      <ul class="space-y-2">
        <li
          v-for="item in archivesByYear"
          :key="item.year"
          class="flex justify-between items-center rounded-md bg-muted/30 px-4 py-2 hover:bg-muted cursor-pointer transition"
        >
          <NuxtLink :to="`/blog/archives?year=${item.year}`" class="flex justify-between w-full">
            <span class="font-medium">{{ item.year }}</span>
            <span class="text-muted-foreground">{{ item.count }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- カテゴリ -->
    <div>
      <div class="flex items-center gap-2 mb-2">
        <LucideHash class="h-4 w-4 text-muted-foreground" />
        <h3 class="text-base font-semibold">カテゴリ</h3>
      </div>

      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="(count, category) in archivesByCategory"
          :key="category"
          :to="`/blog/archives?category=${category}`"
          class="rounded-md bg-muted/30 px-3 py-1 hover:bg-muted transition"
        >
          {{ category }}
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
