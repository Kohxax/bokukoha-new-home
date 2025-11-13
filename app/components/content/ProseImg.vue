<template>
    <figure class="my-6">
        <img :src="src" :alt="alt" class="rounded-lg shadow" />

        <figcaption v-if="alt" class="text-md text-center text-muted-foreground mt-2">
            {{ alt }}
        </figcaption>
    </figure>
</template>

<script setup lang="ts">
defineProps({
    src: String,
    alt: String
})
</script>
