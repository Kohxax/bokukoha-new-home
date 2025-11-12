<script setup lang="ts">
import { CalendarDays, Archive } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import Archives from '~/components/partials/Archives.vue';

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
    <div class="container mx-auto px-4 py-8 md:py-12 min-h-screen max-w-7xl">
        <div class="grid justify-center grid-cols-[minmax(0,800px)_0px]">
            <div class="max-w-[800px] w-full">
                <div class="flex items-center justify-between mb-5">
                    <h1 class="text-3xl font-bold tracking-tight">Blog</h1>

                    <Button variant="outline" class="xl:hidden">
                        <NuxtLink to="/blog/archives"
                            class="text-sm flex flex-row gap-x-2">
                            <Archive class="h-6 w-6 mt-0.5" />
                            <span>
                                アーカイブ
                            </span>
                        </NuxtLink>
                    </Button>
                </div>

                <div class="space-y-6 md:space-y-12">
                    <Card v-for="post in paginatedPosts" :key="post.path"
                        class="overflow-hidden transition-all hover:shadow-lg">
                        <NuxtLink :to="post.path">
                            <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title"
                                class="h-40 md:h-80 w-full object-cover" />
                        </NuxtLink>
                        <CardHeader>
                            <Button variant="secondary" size="sm" as-child class="w-18">
                                <NuxtLink :to="`/blog/archives?category=${post.category}`">
                                {{ post.category }}
                                </NuxtLink>
                            </Button>
                            <NuxtLink class="text-2xl mt-3" :to="post.path">
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

            <aside class="hidden xl:block mx-12 w-60 shrink-0 self-start sticky top-42">
                <Archives />
            </aside>
        </div>

        <NotFound v-if="!posts || posts.length === 0" />
    </div>
</template>
