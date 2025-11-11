<script lang="ts" setup>
import { Github, ChevronDown, ArrowRight, Layout } from "lucide-vue-next"
import MisskeyIcon from "~/components/svg/MisskeyIcon.vue"
import XIcon from "~/components/svg/XIcon.vue"
import DiscordIcon from "~/components/svg/DiscordIcon.vue"
import Avatar from "~/components/ui/avatar/Avatar.vue";
import { ref, onMounted, onUnmounted } from 'vue'

useHead({
    title: 'Koha - Home'
})

const links = [
    {
        title: "GitHub",
        icon: Github,
        href: "https://github.com/Kohxax"
    },
    {
        title: "Misskey",
        icon: MisskeyIcon,
        href: "https://misskey.io/@bokukoha"
    },
    {
        title: "X",
        icon: XIcon,
        href: "https://x.com/kohxax"
    },
    {
        title: "Discord",
        icon: DiscordIcon,
        href: "https://discord.com/users/441869177389580308'"
    }
]

const { data: blogPosts } = await useAsyncData('blog-list', () => {
    return queryCollection('blog')
        .where('draft', '=', '0')
        .select('title', 'category', 'path', 'description', 'date', 'coverImage')
        .order('date', 'DESC')
        .limit(3)
        .all()
})

const { data: works } = await useAsyncData('work-list', () => {
    return queryCollection('work')
        .where('draft', '=', '0')
        .select('title', 'category', 'path', 'description', 'date', 'coverImage')
        .order('date', 'DESC')
        .limit(2)
        .all()
})

const isAtTop = ref(true)

const handleScroll = () => {
    isAtTop.value = window.scrollY < 50
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

const scrollToContent = () => {
    const contentSection = document.getElementById('content');
    if (contentSection) {
        contentSection.scrollIntoView({ behavior: 'smooth' });
    }
}
</script>

<template>

    <div class="relative">

        <main class="relative flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-4 text-center">

            <div class="flex flex-col items-center justify-center space-y-4">
                <Avatar class="mb-3 h-50 w-50 shadow-xl" style="view-transition-name: main-avatar">
                    <img src="~/assets/img/icon_glass.png" alt="Koha" />
                    <AvatarFallback>KH</AvatarFallback>
                </Avatar>

                <NuxtLink to="/about" class="space-y-3 transition-colors hover:opacity-85 duration-300 group">
                    <h1
                        class="text-3xl font-bold tracking-tight relative inline-block text-foreground group-hover:text-foreground">
                        Koha
                        <span
                            class="absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300 ease-out w-full md:w-0 md:group-hover:w-full"></span>
                    </h1>

                    <p class="max-w-md text-muted-foreground">
                        素敵なシナリオとお酒が好きです。
                        スタレ・崩壊3rd・飲酒・旅行が好きで、そのあたりのオタクをやっています。
                        技術系の挑戦をするのも好き。
                    </p>
                </NuxtLink>

                <div class="mt-4 flex gap-x-5 text-foreground">
                    <a v-for="link in links" :key="link.title" :href="link.href" target="_blank"
                        rel="noopener noreferrer" class="hover:opacity-80 hover:scale-98 transition">
                        <component :is="link.icon" class="h-6 w-6" />
                    </a>
                </div>
            </div>

            <div @click="scrollToContent"
                class="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer transition-opacity duration-300"
                :class="{ 'opacity-0 pointer-events-none': !isAtTop }">
                <ChevronDown
                    class="h-9 w-9 animate-bounce text-foreground hover:opacity-80 hover:scale-90 transition" />
            </div>

        </main>

        <section id="content" class="container mx-auto max-w-5xl px-6 py-12 space-y-12">

            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold tracking-tight">Blog</h2>
                    <NuxtLink to="/blog"
                        class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        すべて見る
                        <ArrowRight class="h-4 w-4" />
                    </NuxtLink>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card v-for="post in blogPosts" :key="post.path"
                        class="overflow-hidden transition-all hover:opacity-80 hover:scale-99">
                        <NuxtLink :to="post.path">
                            <img :src="post.coverImage" :alt="post.title" class="aspect-video w-full object-cover" />
                            <CardHeader>
                                <div class="flex items-center justify-between text-sm pt-4 text-muted-foreground">
                                    <span>{{ post.category }}</span>
                                    <span>{{ post.date }}</span>
                                </div>
                                <CardTitle class="pt-1 text-lg line-clamp-2">{{ post.title }}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription class="line-clamp-2 pt-3">{{ post.description }}</CardDescription>
                            </CardContent>
                        </NuxtLink>
                    </Card>
                </div>
            </div>

            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold tracking-tight">Work</h2>
                    <NuxtLink to="/work"
                        class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        すべて見る
                        <ArrowRight class="h-4 w-4" />
                    </NuxtLink>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card v-for="work in works" :key="work.path"
                        class="overflow-hidden transition-all hover:opacity-80 hover:scale-99">
                        <NuxtLink :to="work.path">
                            <img :src="work.coverImage" :alt="work.title"
                                class="aspect-video h-55 w-full object-cover" />
                            <CardHeader>
                                <div class="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>{{ work.category }}</span>
                                    <span>{{ work.date }}</span>
                                </div>
                                <CardTitle class="py-2 text-lg">{{ work.title }}</CardTitle>
                            </CardHeader>
                        </NuxtLink>
                    </Card>
                </div>
            </div>

        </section>

    </div>

</template>
