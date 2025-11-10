<template>
    <div class="min-h-screen">
        <slot />
    </div>
</template>

<script lang="ts" setup>
useHead ({
    htmlAttrs: {
        class: 'dark',
        lang: 'ja'
    }
})
</script>