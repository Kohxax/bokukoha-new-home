export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/blog/' || to.path === '/blog') {
    return navigateTo('/blog/page/1/', { redirectCode: 301 })
  }
})
