import vine from '@vinejs/vine'
import { INCIDENT_STATUSES } from '#constants/incident'

export const createIncidentValidator = vine.compile(
  vine.object({
    serviceId: vine
      .number()
      .exists({ table: 'services', column: 'id' }),

    title: vine.string().trim().minLength(5).maxLength(150),
    message: vine.string().trim().minLength(10),
    status: vine.enum(INCIDENT_STATUSES),
  })
)

export const updateIncidentValidator = vine.compile(
  vine.object({
    status: vine.enum(INCIDENT_STATUSES).optional(),
    message: vine.string().trim().minLength(10).optional(),
  })
)
