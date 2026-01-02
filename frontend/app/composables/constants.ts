export const INCIDENT_STATUSES = [
  'investigating',
  'identified',
  'monitoring',
  'resolved'
] as const

export type IncidentStatus = (typeof INCIDENT_STATUSES)[number]

export const SERVICE_STATUSES = ['operational', 'down'] as const
export type ServiceStatus = (typeof SERVICE_STATUSES)[number]

export const SERVICE_STATUS_CONFIG: Record<ServiceStatus, { label: string; className: string; color: string }> = {
  operational: {
    label: 'Operational',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    color: '#10b981',
  },
  down: {
    label: 'Down',
    className: 'bg-red-50 text-red-700 border-red-200',
    color: '#ef4444',
  },
}

export const SYSTEM_STATUSES = ['operational', 'down'] as const
export type SystemStatus = (typeof SYSTEM_STATUSES)[number]

export const SYSTEM_STATUS_CONFIG: Record<SystemStatus, { title: string; message: string; className: string; iconColor: string; icon: any }> = {
  operational: {
    title: 'All Systems Operational',
    message: 'All services are running smoothly with no current issues.',
    className: 'bg-emerald-50 border border-emerald-200',
    iconColor: '#059669',
    icon: 'CheckCircle2',
  },
  down: {
    title: 'Some Systems Are Experiencing Issues',
    message: 'We are actively investigating and working to resolve the issues.',
    className: 'bg-amber-50 border border-amber-200',
    iconColor: '#b45309',
    icon: 'AlertCircle',
  },
}
