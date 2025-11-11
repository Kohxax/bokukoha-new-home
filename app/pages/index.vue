<template>

    <div class="relative">

        <main class="group relative flex flex-1 flex-col items-center justify-center p-4 text-center min-h-screen">

            <Avatar class="mb-3 h-50 w-50 shadow-xl" style="view-transition-name: main-avatar">
                <img src="~/assets/img/icon_glass.png" alt="Koha" />
                <AvatarFallback>KH</AvatarFallback>
            </Avatar>

            <NuxtLink to="/about" class="mb-3 text-3xl font-bold tracking-tight">
                <h1
                    class="relative inline-block text-foreground transition-colors hover:scale-99 hover:opacity-85 duration-300 group-hover:text-foreground">
                    Koha
                    <span
                        class="absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300 ease-out w-full md:w-0 md:group-hover:w-full"></span>
                </h1>
            </NuxtLink>


            <p class="max-w-md text-muted-foreground">
                素敵なシナリオとお酒が好きです。
                スタレ・崩壊3rd・飲酒・旅行が好きで、そのあたりのオタクをやっています。
                技術系の挑戦をするのも好き。
            </p>

            <div class="mt-5 flex gap-x-5 text-foreground">
                <a v-for="link in links" :key="link.title" :href="link.href" target="_blank" rel="noopener noreferrer"
                    class="hover:opacity-75 hover:scale-98 transition-colors">
                    <component :is="link.icon" class="h-6 w-6" />
                </a>
            </div>

            <div @click="scrollToContent" class="absolute bottom-7 left-1/2 -translate-x-1/2 cursor-pointer">
                <ChevronDown
                    class="h-9 w-9 animate-bounce text-foreground hover:opacity-75 hover:scale-90 transition-colors" />
            </div>

        </main>

        <section id="content" class="container mx-auto max-w-5xl px-6 pb-6 pt-4 sm:pb-6 sm:pt-6 space-y-16">

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
                    <Card v-for="post in blogPosts" :key="post.id"
                        class="overflow-hidden transition-all hover:shadow-lg">
                        <img :src="post.img" :alt="post.title" class="aspect-video w-full object-cover" />
                        <CardHeader>
                            <div class="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{{ post.tag }}</span>
                                <span>{{ post.date }}</span>
                            </div>
                            <CardTitle class="pt-2 text-lg">{{ post.title }}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{{ post.description }}</CardDescription>
                        </CardContent>
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
                    <Card v-for="project in projects" :key="project.id"
                        class="overflow-hidden transition-all hover:shadow-lg">
                        <img :src="project.img" :alt="project.title" class="aspect-video w-full object-cover" />
                        <CardHeader>
                            <span class="text-xs text-muted-foreground">{{ project.tag }}</span>
                            <CardTitle class="pt-2 text-lg">{{ project.title }}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{{ project.description }}</CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </section>

    </div>

</template>

<script lang="ts" setup>
import { Github, ChevronDown } from "lucide-vue-next"
import MisskeyIcon from "~/components/svg/MisskeyIcon.vue"
import XIcon from "~/components/svg/XIcon.vue"
import DiscordIcon from "~/components/svg/DiscordIcon.vue"
import Avatar from "~/components/ui/avatar/Avatar.vue";

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

const blogPosts = [
    {
        id: 1,
        tag: '技術',
        date: '2025年11月8日',
        title: '銀狼',
        description: 'ここは説明文です',
        img: '/images/temp/a.png'
    },
    {
        id: 2,
        tag: '雑記',
        date: '2025年11月1日',
        title: 'タイトル',
        description: 'ああああああああああああ',
        img: '/images/temp/a.png'
    },
    {
        id: 3,
        tag: '雑記',
        date: '2025年10月28日',
        title: '？',
        description: '？？？？？？？？？？？',
        img: '/images/temp/a.png'
    },
]

const projects = [
    {
        id: 1,
        tag: 'Web',
        title: '個人サイト',
        description: '文字',
        img: '/images/temp/a.png'
    },
    {
        id: 2,
        tag: 'Minecraft',
        title: 'AWS S3活用',
        description: 'やあ.',
        img: '/images/temp/a.png'
    },
]

const scrollToContent = () => {
    const contentSection = document.getElementById('content');
    if (contentSection) {
        contentSection.scrollIntoView({ behavior: 'smooth' });
    }
}
</script>
