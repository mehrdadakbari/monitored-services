<script setup lang="ts">
import ServiceCard from '~/components/ServiceCard.vue'
import SystemStatusBanner from '~/components/SystemStatusBanner.vue'
import { useServices } from '~/composables/useServices'
import { useAuth } from '~/composables/useAuth'

const { isLoggedIn } = useAuth()

const {
  services,
  pending,
  hasIssues,
  lastUpdated,
  isServiceDialogOpen,
  isCreatingService,
  newService,
  selectedService,
  serviceIncidents,
  createService,
  fetchIncidents
} = useServices()
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900">Service Status Dashboard</h1>
          <p class="text-slate-600 mt-2">Real-time status of all systems and services</p>
        </div>
        <div class="flex gap-2">
          <button v-if="isLoggedIn" @click="isServiceDialogOpen = true" class="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
            Add Service
          </button>
          <NuxtLink to="/login" class="px-4 py-2 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-colors">Admin Access</NuxtLink>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SystemStatusBanner :status="hasIssues ? 'down' : 'operational'" />

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
        <div v-if="pending" class="animate-pulse flex space-x-4">Loading...</div>
        <ServiceCard
          v-else
          v-for="service in services"
          :key="service.id"
          :service="{ ...service, lastUpdated: new Date(service.updatedAt) }"
          @click="selectedService = service"
          class="cursor-pointer"
        />
      </div>

      <div class="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-600">
        Status page last updated: {{ lastUpdated ? lastUpdated.toLocaleString() : '-' }}
        <p class="text-xs text-slate-500 mt-2">Updates are refreshed every 10 seconds</p>
      </div>
    </main>

    <div v-if="isServiceDialogOpen && isLoggedIn" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold text-slate-900 mb-2">Add New Service</h2>
        <form @submit.prevent="createService" class="space-y-4">
          <input v-model="newService.name" type="text" placeholder="Service Name" required class="w-full px-3 py-2 border rounded-lg"/>
          <textarea v-model="newService.description" placeholder="Description (optional)" class="w-full px-3 py-2 border rounded-lg"></textarea>
          <select v-model="newService.status" required class="w-full px-3 py-2 border rounded-lg">
            <option value="" disabled>Select Status</option>
            <option value="operational">Operational</option>
            <option value="down">Down</option>
          </select>
          <button type="submit" class="w-full px-4 py-2 bg-slate-900 text-white rounded-lg">
            {{ isCreatingService ? 'Creating...' : 'Create Service' }}
          </button>
        </form>
        <button @click="isServiceDialogOpen = false" class="mt-4 w-full border rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-50">Close</button>
      </div>
    </div>

    <div v-if="selectedService" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 class="text-xl font-bold text-slate-900 mb-2">{{ selectedService.name }}</h2>
        <p class="text-slate-600 mb-4">{{ selectedService.description || 'No description' }}</p>
        <p class="text-sm font-medium">Status: {{ selectedService.status }}</p>
        <h3 class="mt-4 font-semibold text-slate-900">Incidents</h3>
        <ul class="mt-2 space-y-2">
          <li v-for="incident in serviceIncidents" :key="incident.id" class="border p-2 rounded-lg">
            <span class="font-medium">{{ incident.title }}</span> - {{ incident.status }}
          </li>
        </ul>
        <button @click="selectedService = null" class="mt-4 w-full border rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-50">Close</button>
      </div>
    </div>
  </div>
</template>
