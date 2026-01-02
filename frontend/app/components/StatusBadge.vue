<template>
  <span
    :class="['inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border', config.className]"
  >
    <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: config.color }"></span>
    {{ config.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ServiceStatus } from '~/composables/constants'
import { SERVICE_STATUS_CONFIG } from '~/composables/constants'

interface Props {
  status: ServiceStatus
}

const props = defineProps<Props>()

const config = computed(() => SERVICE_STATUS_CONFIG[props.status])
</script>
