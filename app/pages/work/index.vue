<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { watch } from 'vue';

const route = useRoute()
const { data: posts } = await useAsyncData('work-list', () => {
    return queryCollection('work')
        .where('draft', '=', '0') // draft = 0 (false)は載せるようにする, bool読めないのバカすぎ
        .select('title', 'category', 'path', 'description', 'date', 'coverImage')
        .order('date', 'DESC')
        .all()
});

watch(
  () => route.query.page,
  () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
)

useHead({
    title: 'Work'
})
</script>

<template>
    <div class="container mx-auto max-w-5xl px-4 py-8 md:py-12 min-h-screen">
        <div class="mx-auto max-w-4xl gap-6">
            <h1 class="mb-8 text-3xl font-bold tracking-tight">Work</h1>
            <div class="space-y-12">
                <Card v-for="post in posts" :key="post.path"
                    class="overflow-hidden transition-all hover:shadow-lg">
                    <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title"
                        class="h-40 md:h-80 w-full object-cover" />
                    <CardHeader>
                        <span
                            class="inline-block px-3 py-1 text-sm font-semibold bg-muted text-center rounded-full w-18">
                            {{ post.category }}
                        </span>
                        <NuxtLink class="text-2xl mt-4" :to="post.path">
                            <CardTitle>{{ post.title }}</CardTitle>
                        </NuxtLink>
                        <div class="flex flex-row items-center gap-x-3 mt-4">
                            <CalendarDays class="text-muted-foreground scale-80" />
                            <span class="text-base text-muted-foreground">{{ post.date }}</span>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>

        <NotFound v-if="!posts || posts.length === 0" />
    </div>
</template>
