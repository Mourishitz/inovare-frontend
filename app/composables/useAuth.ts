import type { User, AuthState, LoginCredentials, LoginResponse, ApiResponse } from '~/types'
import { UserRole } from '~/types'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBase
  
  const user = useState<User | null>('auth-user', () => null)
  const token = useState<string | null>('auth-token', () => null)

  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === UserRole.ADMIN)
  const isBride = computed(() => user.value?.role === UserRole.BRIDE)

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await $fetch<LoginResponse>(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        body: credentials
      })

      if (response.token && response.user) {
        user.value = response.user
        token.value = response.token
        
        // Store token in localStorage for persistence
        if (import.meta.client) {
          localStorage.setItem('auth-token', response.token)
          localStorage.setItem('auth-user', JSON.stringify(response.user))
        }
        
        return true
      }
      
      return false
    } catch (error: any) {
      return false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    
    if (import.meta.client) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
    }
    
    navigateTo('/login')
  }

  const checkAuth = async (): Promise<boolean> => {
    if (import.meta.server) return false
    
    const storedToken = localStorage.getItem('auth-token')
    const storedUser = localStorage.getItem('auth-user')
    
    if (!storedToken || !storedUser) return false

    try {
      const parsedUser = JSON.parse(storedUser) as User
      user.value = parsedUser
      token.value = storedToken
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isBride,
    login,
    logout,
    checkAuth
  }
}
