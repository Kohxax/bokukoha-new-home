<template>

    <div class="relative flex min-h-screen flex-col">

        <main class="flex flex-1 flex-col items-center justify-center p-4 text-center">

            <Avatar class="mb-3 h-50 w-50 shadow-xl">
                <img src="~/assets/img/icon_glass.png" alt="Koha" />
                <AvatarFallback>KH</AvatarFallback>
            </Avatar>

            <h1 class="mb-3 text-3xl font-bold tracking-tight">Koha</h1>

            <p class="max-w-md text-muted-foreground">
                素敵なシナリオとお酒が好きです。
                スタレ・崩壊3rd・飲酒・旅行が好きで、そのあたりのオタクをやっています。
                技術系の挑戦をするのも好き。
            </p>

            <div class="mt-5 flex gap-x-5 text-muted-foreground">
                <a v-for="link in links" :key="link.title" :href="link.href" target="_blank" rel="noopener noreferrer" class="hover:opacity-75 transition-colors">
                    <component :is="link.icon" class="h-6 w-6" />
                </a>
            </div>
            
        </main>

    </div>

</template>

<script lang="ts" setup>
import { Github } from "lucide-vue-next"
import MisskeyIcon  from "~/components/svg/MisskeyIcon.vue"
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

</script>
