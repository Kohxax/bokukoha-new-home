<script setup>
const props = defineProps({
  category: String,
  currentPath: String
})

const { data: related } = await useAsyncData(
  `related-${props.category}-${props.currentPath}`,
  () =>
    queryCollection("blog")
      .where("category", "=", props.category)
      .where("path", "!=", props.currentPath)
      .select("title", "path", "date", "category", "coverImage")
      .order("date", "DESC")
      .limit(3)
      .all()
)
</script>

<template>
  <div v-if="related?.length" class="mt-3 pt-8 space-y-6">
    <h2 class="text-lg font-semibold tracking-tight">
      関連する投稿
    </h2>

    <div class="relative">
      <div class="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none
             mx-auto max-w-full px-1 sm:px-0">
        <Card v-for="post in related" :key="post.path" class="overflow-hidden transition-all hover:opacity-80 hover:scale-[0.99]
               shrink-0 w-[300px] sm:w-[320px] snap-center">
          <NuxtLink :to="post.path">
            <img :src="post.coverImage" :alt="post.title" class="aspect-video w-full object-cover" />
            <CardHeader>
              <div class="flex items-center justify-between text-sm pt-4 text-muted-foreground">
                <span>{{ post.category }}</span>
                <span>{{ post.date }}</span>
              </div>
              <CardTitle class="pt-1 text-lg line-clamp-2">{{ post.title }}</CardTitle>
            </CardHeader>
          </NuxtLink>
        </Card>
      </div>
    </div>
  </div>
</template>
