export default defineNuxtPlugin({
  name: 'auth-init',
  parallel: false,
  async setup() {
    const { checkAuth } = useAuth()
    
    // Initialize auth state from storage on client-side
    if (import.meta.client) {
      await checkAuth()
    }
  }
})
