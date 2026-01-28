// API utility composable for making requests to backend
export const useApi = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  const apiCall = async <T>(endpoint: string, options: any = {}): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    // Add authorization token if available
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    const url = `${config.public.apiBase}${endpoint}`
    
    console.log('API Call:', {
      method: options.method || 'GET',
      url,
      hasToken: !!token.value
    })

    try {
      const response = await $fetch<T>(url, {
        ...options,
        headers
      })
      
      console.log('API Response:', response)
      return response
    } catch (error: any) {
      console.error('API Error:', {
        url,
        error: error.message,
        data: error.data,
        statusCode: error.statusCode
      })
      throw error
    }
  }

  return {
    apiCall
  }
}
