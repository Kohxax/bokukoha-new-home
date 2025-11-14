<script setup>
import { definePerson, defineWebPage, defineWebSite, useSchemaOrg } from '@unhead/schema-org/vue'

const route = useRoute()
useHead({
  templateParams: {
    schemaOrg: {
      host: 'https://www.bokukoha.dev',
      path: route.path,
      inLanguage: 'ja'
    }
  }
})

useSchemaOrg([
  defineWebPage(),
  defineWebSite({
    name: 'ぼくこは.dev',
    description: 'ぼくこは.devはこはのプロフィールやブログ記事、ポートフォリオをまとめた個人サイトです。'
  }),

  definePerson({
    name: 'こは',
    url: 'https://www.bokukoha.dev',
    image: 'https://www.bokukoha.dev/images/og/coverImage.png',
    sameAs: [
      'https://blog.bokukoha.dev',
      'https://misskey.io/bokukoha',
      'https://x.com/kohxax'
    ]
  })
])

useSeoMeta({
  ogImage: '/og/coverImage.png'
})

</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <AppFooter />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}
.page-enter-from{
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to{
  opacity: 0;
  transition: translateY(-10px);
}
</style>