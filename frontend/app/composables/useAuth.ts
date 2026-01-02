import { ref, computed } from 'vue'

export const useAuth = () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  })

  const user = useState('auth_user', () => null as { id: number; email: string; fullName: string } | null)

  const isLoggedIn = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    const config = useRuntimeConfig()

    try {
      const data: {
        type: string
        token: { type: string; token: string; name: string | null; abilities: string[]; lastUsedAt: string | null; expiresAt: string | null }
        user: { id: number; email: string; fullName: string }
      } = await $fetch(`${config.public.apiBase}/login`, {
        method: 'POST',
        body: { email, password }
      })

      token.value = data.token.token
      user.value = data.user

      return { success: true }
    } catch (error: any) {
      console.error('Login Error:', error)
      const message = error?.data?.message || 'Email or password is incorrect.'
      return { success: false, message }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    return navigateTo('/login')
  }

  return {
    token,
    user,
    login,
    logout,
    isLoggedIn
  }
}
