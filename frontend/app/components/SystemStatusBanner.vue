<template>
  <div :class="config.className + ' rounded-lg p-4 mb-8'">
    <div class="flex items-center gap-3">
      <component :is="iconComponent" class="w-5 h-5" :class="config.iconColorClass" />
      <div>
        <h2 class="font-semibold" :class="titleColor">{{ config.title }}</h2>
        <p class="text-sm mt-1" :class="messageColor">{{ config.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, CheckCircle2 } from 'lucide-vue-next'
import type { SystemStatus } from '~/composables/constants'
import { SYSTEM_STATUS_CONFIG } from '~/composables/constants'

interface Props {
  status: SystemStatus
}

const props = defineProps<Props>()

const config = computed(() => {
  const cfg = SYSTEM_STATUS_CONFIG[props.status]
  return { ...cfg, iconColorClass: `text-[${cfg.iconColor}]` }
})

const iconComponent = computed(() => {
  return props.status === 'operational' ? CheckCircle2 : AlertCircle
})

const titleColor = computed(() => props.status === 'operational' ? 'text-emerald-900' : 'text-amber-900')
const messageColor = computed(() => props.status === 'operational' ? 'text-emerald-700' : 'text-amber-700')
</script>
