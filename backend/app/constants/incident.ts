export const INCIDENT_STATUSES = [
  'investigating',
  'identified',
  'monitoring',
  'resolved',
] as const

export type IncidentStatus = (typeof INCIDENT_STATUSES)[number]
