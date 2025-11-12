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