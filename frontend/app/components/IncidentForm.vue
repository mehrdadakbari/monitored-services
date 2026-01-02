<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-2">
      <label for="service" class="block text-sm font-medium text-slate-900">
        Service
      </label>
      <select
        id="service"
        v-model.number="serviceId"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="isLoading"
      >
        <option value="" disabled>Select a service</option>
        <option v-for="service in services" :key="service.id" :value="service.id">
          {{ service.name }}
        </option>
      </select>
    </div>

    <div class="space-y-2">
      <label for="title" class="block text-sm font-medium text-slate-900">
        Incident Title
      </label>
      <input
        id="title"
        v-model="title"
        type="text"
        placeholder="Brief description of the incident"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="isLoading"
        required
      />
    </div>

    <div class="space-y-2">
      <label for="description" class="block text-sm font-medium text-slate-900">
        Description
      </label>
      <textarea
        id="description"
        v-model="description"
        placeholder="Detailed description of what happened and current status"
        rows="4"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="isLoading"
        required
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-600 mb-1">Current status of the incident</label>
      <select
        v-model="status"
        class="w-full border-gray-300 border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        :disabled="isLoading"
      >
        <option value="" disabled>Select a status</option>
        <option v-for="s in $INCIDENT_STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <button
      type="submit"
      :disabled="isLoading"
      class="w-full px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {{ isLoading ? 'Creating incident...' : 'Create Incident' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IncidentStatus } from '~/composables/constants'

const $INCIDENT_STATUSES = INCIDENT_STATUSES

export interface IncidentFormData {
  serviceId: number
  title: string
  description: string
  status: IncidentStatus
}

interface Service {
  id: number
  name: string
}

interface Props {
  services: Service[]
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  submit: [data: IncidentFormData]
}>()

const serviceId = ref<number | null>(null)
const title = ref('')
const description = ref('')
const status = ref<IncidentStatus | ''>('')

const handleSubmit = () => {
  if (!serviceId.value || !title.value || !description.value || !status.value) return

  emit('submit', {
    serviceId: serviceId.value,
    title: title.value,
    description: description.value,
    status: status.value,
  })

  serviceId.value = null
  title.value = ''
  description.value = ''
  status.value = ''
}
</script>
