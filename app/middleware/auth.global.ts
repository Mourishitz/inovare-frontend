export default defineNuxtRouteMiddleware(async (to, _from) => {
  // Only run on client-side
  if (import.meta.server) return
  
  const { isAuthenticated, checkAuth } = useAuth()
  const isPublicRoute = to.path === '/login'
    || to.path === '/signup'
    || to.meta.public === true
    || to.matched.some(record => record.meta.public === true)
    || String(to.name) === 'slug'
  
  // Always check auth from storage
  await checkAuth()
  
  // If authenticated and trying to access login/signup, redirect to home
  // Exception: allow /signup when the user is resuming the onboarding flow
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/signup')) {
    if (to.path === '/signup' && sessionStorage.getItem('signup-current-step')) {
      return
    }
    return navigateTo('/', { replace: true })
  }
  
  // Skip check for auth pages and routes explicitly exposed to the public
  if (isPublicRoute) {
    return
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo('/login', { replace: true })
  }
})
