import { ref, computed, onMounted } from 'vue'
import { useAuth } from './useAuth'

export interface Service {
  id: string | number
  name: string
  description?: string
  status: 'operational' | 'down'
  updatedAt: string,
  incidents: Incident[]
}

export interface Incident {
  id: string
  serviceId: string | number
  serviceName: string
  title: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  createdAt: string
}

export const useServices = () => {
  const services = ref<Service[]>([])
  const incidents = ref<Incident[]>([])
  const pending = ref(true)
  const lastUpdated = ref<Date | null>(null)
  const isServiceDialogOpen = ref(false)
  const isCreatingService = ref(false)
  const selectedService = ref<Service | null>(null)
  const newService = ref({ name: '', description: '', status: '' })

  const { token } = useAuth()
  const config = useRuntimeConfig()

  const fetchServices = async () => {
    pending.value = true
    try {
      const res: { data: Service[] } = await $fetch(`${config.public.apiBase}/services`, {
        headers: { 'x-nitro-cache': 'no-cache' }
      })
      services.value = res.data
      lastUpdated.value = new Date()
    } catch (e) {
      console.error('Failed to fetch services', e)
    } finally {
      pending.value = false
    }
  }

  const fetchIncidents = async () => {
    if (!token.value) return
    try {
      const res: { data: Incident[] } = await $fetch(`${config.public.apiBase}/admin/incidents`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      incidents.value = res.data.map(i => ({
        ...i,
        serviceName: services.value.find(s => String(s.id) === String(i.serviceId))?.name || 'Unknown Service'
      }))
      console.log(incidents.value);
    } catch (e) {
      console.error('Failed to fetch incidents', e)
    }
  }

  const createService = async () => {
    if (!newService.value.name || !newService.value.status) return
    isCreatingService.value = true
    try {
      const res: { data: Service } = await $fetch(`${config.public.apiBase}/admin/services`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: newService.value
      })
      services.value.push(res.data)
      isServiceDialogOpen.value = false
      newService.value = { name: '', description: '', status: '' }
    } catch (e) {
      console.error('Failed to create service', e)
    } finally {
      isCreatingService.value = false
    }
  }

  const hasIssues = computed(() => services.value.some(s => s.status !== 'operational'))

  const serviceIncidents = computed(() =>
    selectedService.value
      ? selectedService.value.incidents
      : []
  )

  onMounted(() => {
    fetchServices()
    const interval = setInterval(fetchServices, 10000)
    return () => clearInterval(interval)
  })

  return {
    services,
    incidents,
    pending,
    lastUpdated,
    hasIssues,
    isServiceDialogOpen,
    isCreatingService,
    selectedService,
    newService,
    serviceIncidents,
    fetchServices,
    fetchIncidents,
    createService
  }
}
