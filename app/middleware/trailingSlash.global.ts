export default defineNuxtRouteMiddleware((to, from) => {
  if ( to.path.endsWith('/') ) return
  
  if ( to.path.match(/\.[a-zA-Z0-9]+$/) ) return
  
  return navigateTo({
    path: to.path + '/',
    query: to.query,
    hash: to.hash,
    replace: true
  })
})