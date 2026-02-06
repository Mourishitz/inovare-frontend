export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side
  if (import.meta.server) return
  
  const { isAuthenticated, checkAuth } = useAuth()
  
  // Always check auth from storage
  await checkAuth()
  
  // If authenticated and trying to access login/signup, redirect to home
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/', { replace: true })
  }
  
  // Skip check for login and signup pages
  if (to.path === '/login' || to.path === '/signup') {
    return
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo('/login', { replace: true })
  }
})
