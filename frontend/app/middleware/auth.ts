export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('auth_token')
  if (!token.value) {
    console.log('No token found, redirecting to login...')
    return navigateTo('/login')
  }
})
