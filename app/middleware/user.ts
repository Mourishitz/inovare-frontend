import { UserRole } from '~/types'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, isAuthenticated, checkAuth } = useAuth()

  // Ensure user is authenticated first
  if (!isAuthenticated.value) {
    await checkAuth()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Check if user has bride/user role (not admin)
  if (user.value?.role !== UserRole.BRIDE) {
    return navigateTo('/admin')
  }
})
