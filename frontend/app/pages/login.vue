<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { login, token } = useAuth()
const loading = ref(false)
const error = ref('')
const form = reactive({ email: '', password: '' })

onMounted(() => {
  if (token.value) navigateTo('/admin')
})

const handleLogin = async () => {
  if (loading.value) return
  loading.value = true
  error.value = ''

  try {
    const result = await login(form.email, form.password)
    if (result.success) {
      await nextTick()
      navigateTo('/admin', { replace: true })
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = 'Internal server error'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <NuxtLink to="/" class="flex justify-center mb-8">
        <span class="text-lg font-bold text-slate-900">Service Status</span>
      </NuxtLink>

      <div class="bg-white border border-slate-200 rounded-lg p-6 sm:p-8">
        <div class="space-y-1 mb-6">
          <h1 class="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p class="text-slate-600 text-sm">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-slate-900">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="admin@admin.com"
              :disabled="loading"
              autofocus
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-slate-900">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              :disabled="loading"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>

        <div class="mt-6 pt-4 border-t border-slate-200">
          <p class="text-sm text-slate-600 text-center">
            Demo credentials:
          </p>
          <p class="text-xs text-slate-500 text-center mt-2">
            Email: <code class="bg-slate-100 px-2 py-1 rounded">admin@admin.com</code>
          </p>
          <p class="text-xs text-slate-500 text-center mt-1">
            Password: <code class="bg-slate-100 px-2 py-1 rounded">admin123</code>
          </p>
        </div>

        <div class="mt-6">
          <NuxtLink to="/">
            <button class="w-full px-4 py-2 text-slate-700 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Back to Status Page
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
