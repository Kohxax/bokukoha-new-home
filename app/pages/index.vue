<template>

    <div class="relative flex min-h-screen flex-col">

        <main class="flex flex-1 flex-col items-center justify-center p-4 text-center">

            <Avatar class="mb-6 h-40 w-40 shadow-xl">
                <img src="~/assets/img/icon_glass.png" alt="Koha" />
                <AvatarFallback>KH</AvatarFallback>
            </Avatar>
            
        </main>

    </div>

</template>

<script lang="ts" setup>
import { Github } from "lucide-vue-next"
</script>
