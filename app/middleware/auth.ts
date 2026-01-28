export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, checkAuth } = useAuth()

  // Check authentication status
  if (!isAuthenticated.value) {
    await checkAuth()
  }

  // If still not authenticated, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
