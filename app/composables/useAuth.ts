import type { User, AuthState, LoginCredentials, LoginResponse, ApiResponse } from '~/types'
import { UserRole } from '~/types'

// Helper function to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    
    if (!decoded.exp) return true
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  } catch (error) {
    // If we can't decode, consider it expired
    return true
  }
}

export const useAuth = () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBase
  
  // Track if auth has been initialized
  const authInitialized = useState<boolean>('auth-initialized', () => false)
  
  // Use useCookie for better persistence
  const tokenCookie = useCookie<string | null>('auth-token', { 
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax'
  })
  
  const user = useState<User | null>('auth-user', () => {
    // Initialize from localStorage on first load
    if (import.meta.client) {
      const stored = localStorage.getItem('auth-user')
      if (stored) {
        try {
          return JSON.parse(stored) as User
        } catch {
          return null
        }
      }
    }
    return null
  })
  
  const token = computed({
    get: () => tokenCookie.value,
    set: (value) => { tokenCookie.value = value }
  })

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
        
        // Store user in localStorage for persistence
        if (import.meta.client) {
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
      localStorage.removeItem('auth-user')
    }
    
    navigateTo('/login')
  }

  const checkAuth = async (): Promise<boolean> => {
    if (import.meta.server) return false
    
    const storedToken = tokenCookie.value
    const storedUser = localStorage.getItem('auth-user')
    
    // Check if token exists
    if (!storedToken || !storedUser) {
      // Clear any leftover data
      user.value = null
      token.value = null
      if (storedUser) localStorage.removeItem('auth-user')
      authInitialized.value = true
      return false
    }

    // Check if token is expired
    if (isTokenExpired(storedToken)) {
      // Token is expired, clear everything
      user.value = null
      token.value = null
      localStorage.removeItem('auth-user')
      authInitialized.value = true
      return false
    }

    // If already authenticated in state with valid token, return true
    if (user.value && token.value) {
      authInitialized.value = true
      return true
    }

    // Restore auth state from storage
    try {
      const parsedUser = JSON.parse(storedUser) as User
      user.value = parsedUser
      authInitialized.value = true
      return true
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem('auth-user')
      token.value = null
      authInitialized.value = true
      return false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isBride,
    authInitialized,
    login,
    logout,
    checkAuth
  }
}
