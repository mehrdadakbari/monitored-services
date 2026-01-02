<template>
  <div class="min-h-screen bg-slate-50">
    <div class="fixed top-5 right-5 flex flex-col gap-3 z-50">
      <transition-group name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'px-4 py-2 rounded-lg shadow-lg text-white transform transition-all duration-300',
            toast.type === 'success' ? 'bg-emerald-500' :
            toast.type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
          ]"
        >
          {{ toast.message }}
        </div>
      </transition-group>
    </div>

    <header class="border-b border-slate-200 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900">
            Admin - Incidents
          </h1>
          <p class="text-slate-600 mt-2">
            Manage service incidents and status updates
          </p>
        </div>
        <div class="flex gap-3 flex-col sm:flex-row">
          <NuxtLink to="/">
            <button class="px-4 py-2 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Back to Status
            </button>
          </NuxtLink>
          <button
            @click="handleLogout"
            class="px-4 py-2 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      <div class="mb-6">
        <button
          @click="isDialogOpen = true"
          class="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          <Plus class="w-4 h-4" />
          Create New Incident
        </button>
      </div>

      <div v-if="isDialogOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 class="text-xl font-bold text-slate-900 mb-2">Create New Incident</h2>
          <p class="text-slate-600 text-sm mb-4">
            Report a new incident affecting one of your services
          </p>
          <IncidentForm
            :services="services"
            :isLoading="isCreating"
            @submit="handleCreateIncident"
          />
          <button
            @click="isDialogOpen = false"
            class="mt-4 w-full px-4 py-2 text-slate-700 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <div v-if="incidents.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-4 py-3 text-left font-semibold text-slate-900">Service</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-900">Incident Title</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-900">Created Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="incident in incidents"
                :key="incident.id"
                class="border-b border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <td class="px-4 py-3 text-slate-900 font-medium">
                  {{ incident.serviceName }}
                </td>
                <td class="px-4 py-3 text-slate-700">{{ incident.title }}</td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
                      incident.status === 'investigating'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : incident.status === 'identified'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : incident.status === 'monitoring'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200' // resolved
                    ]"
                  >
                    {{
                      incident.status === 'investigating'
                        ? 'Investigating'
                        : incident.status === 'identified'
                        ? 'Identified'
                        : incident.status === 'monitoring'
                        ? 'Monitoring'
                        : 'Resolved'
                    }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-600">{{ formatDate(incident.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="px-4 py-8 text-center">
          <p class="text-slate-600">No incidents reported</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { Plus } from 'lucide-vue-next'
import type { IncidentFormData } from '@/components/IncidentForm.vue'

definePageMeta({ middleware: 'auth' })

interface Toast { id: number; message: string; type: 'success' | 'error' | 'info' }
const toasts = ref<Toast[]>([])
const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) => {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, duration)
}

const { token, logout } = useAuth()
const config = useRuntimeConfig()

interface Service { id: string | number; name: string; description?: string; status: 'operational' | 'down'; lastUpdated: Date }
interface Incident { id: string; serviceId: string | number; serviceName: string; title: string; status: 'investigating' | 'identified' | 'monitoring' | 'resolved'; createdAt: Date }

const services = ref<Service[]>([])
const incidents = ref<Incident[]>([])
const isDialogOpen = ref(false)
const isCreating = ref(false)

const { data: servicesData } = await useFetch<{ data: Service[] }>(
  `${config.public.apiBase}/services`,
  { key: 'services-list', server: true, lazy: false, headers: { 'x-nitro-cache': 's-maxage=30' } }
)
services.value = servicesData.value?.data.map(s => ({ ...s, lastUpdated: new Date(s.updatedAt || Date.now()) })) || []

const fetchIncidents = async () => {
  try {
    const res = await $fetch<{ data: { id: string; serviceId: string | number; title: string; status: 'investigating' | 'identified' | 'monitoring' | 'resolved'; createdAt: string }[] }>(
      `${config.public.apiBase}/admin/incidents`,
      { headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json', 'x-nitro-cache': 'no-cache' } }
    )
    incidents.value = res.data.map(i => ({
      ...i,
      serviceName: services.value.find(s => String(s.id) === String(i.serviceId))?.name || 'Unknown Service',
      createdAt: new Date(i.createdAt)
    }))
  } catch (err: any) {
    console.error('Error fetching incidents:', err)
    addToast('Failed to fetch incidents.', 'error')
  }
}

onMounted(async () => {
  if (token.value) {
    await fetchIncidents()
    setInterval(fetchIncidents, 10000)
  }
})

const handleCreateIncident = async (data: IncidentFormData) => {
  if (!data.serviceId || !data.title || !data.description || !data.status) {
    addToast('Please fill in all fields.', 'error')
    return
  }
  isCreating.value = true
  try {
    await $fetch<{ data: { id: string; createdAt: string } }>(
      `${config.public.apiBase}/admin/incidents`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' },
        body: { serviceId: data.serviceId, title: data.title, message: data.description, status: data.status }
      }
    )
    isDialogOpen.value = false
    await fetchIncidents()
    addToast('Incident created and list updated.', 'success')
  } catch (e: any) {
    console.error(e)
    addToast(e.response?._data?.errors?.[0]?.message || 'Error logging the incident.', 'error')
  } finally { isCreating.value = false }
}

const handleLogout = () => {
  logout()
  addToast('Logged out successfully.', 'info')
  navigateTo('/login')
}

const formatDate = (date: Date | string) => format(new Date(date), 'MMM d, yyyy h:mm a')
</script>
