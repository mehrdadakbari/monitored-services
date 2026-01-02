<template>
  <div class="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between gap-4 mb-4">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-slate-900">{{ service.name }}</h3>
        <p v-if="service.description" class="text-sm text-slate-600 mt-1">
          {{ service.description }}
        </p>
      </div>
      <StatusBadge :status="service.status" />
    </div>
    <p class="text-sm text-slate-600">
      Last updated {{ formattedDate }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import StatusBadge from './StatusBadge.vue'
import type { ServiceStatus } from '~/composables/constants'

interface Service {
  id: number
  name: string
  status: ServiceStatus
  updatedAt: string | Date
  description?: string | null
}

interface Props {
  service: Service
}

const props = defineProps<Props>()

const formattedDate = computed(() => {
  const date = typeof props.service.updatedAt === 'string'
    ? new Date(props.service.updatedAt)
    : props.service.updatedAt
  return format(date, 'MMM d, yyyy h:mm a')
})
</script>
