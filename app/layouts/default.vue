<script setup>
import BackToTop from '~/components/partials/BackToTop.vue';

defineOgImageComponent('Normal', {
    fonts: [
        {
            name: 'Noto Sans JP',
            weight: 400,
            path: '/fonts/NotoSansJP-Regular.ttf',
        }
    ]
})

</script>

<template>
    <AppHeader />
    <BackToTop />
    <div class="min-h-screen">
        <slot />
    </div>
</template>