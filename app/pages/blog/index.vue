<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { watch } from 'vue';

const pageSize = 3
const route = useRoute()
const { data: posts } = await useAsyncData('blog-list', () => {
    return queryCollection('blog')
        .where('draft', '=', '0') // draft = 0 (false)は載せるようにする, bool読めないのバカすぎ
        .select('title', 'category', 'path', 'description', 'date', 'coverImage')
        .order('date', 'DESC')
        .all()
});

const totalPosts = computed(() => posts.value?.length ?? 0)
const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalPosts.value / pageSize))
)

const currentPage = computed(() => {
    const p = Number(route.query.page ?? 1)
    const n = Number.isFinite(p) ? p : 1
    return Math.min(Math.max(1, n), totalPages.value)
})

const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return posts.value?.slice(start, end) ?? []
})

const displayPages = computed(() => {
    const pages = new Set<number>([
        1,
        totalPages.value,
        currentPage.value,
        currentPage.value - 1,
        currentPage.value + 1
    ])

    const sorted = [...pages].filter(p => p >= 1 && p <= totalPages.value).sort((a, b) => a - b)

    const result: (number | string)[] = []
    let prev: number | null = null

    for (const p of sorted) {
        if (prev !== null && p - prev > 1) {
            result.push('…')
        }
        result.push(p)
        prev = p
    }

    return result
})

watch(
  () => route.query.page,
  () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
)

useHead({
    title: 'Blog'
})
</script>

<template>
    <div class="container mx-auto max-w-5xl px-4 py-8 md:py-12 min-h-screen" style="view-transition-name: blog-content">
        <div class="mx-auto max-w-4xl gap-6">
            <h1 class="mb-8 text-3xl font-bold tracking-tight">Blog</h1>
            <div class="space-y-12">
                <Card v-for="post in paginatedPosts" :key="post.path"
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

            <div class="mt-10 text-center gap-2">

                <template v-for="item in displayPages" :key="item">
                    <span v-if="item === '…'" class="px-1 text-muted-foreground select-none">…</span>

                    <Button v-else size="lg" :variant="item === currentPage ? 'default' : 'ghost'"
                        class="transition-none min-w-8" @click="$router.push({ query: { page: item } })">
                        {{ item }}
                    </Button>
                </template>
            </div>
        </div>

        <NotFound v-if="!posts || posts.length === 0" />
    </div>
</template>
