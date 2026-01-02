export const SERVICE_STATUSES = [
  'operational',
  'down',
] as const

export type ServiceStatus = (typeof SERVICE_STATUSES)[number]
