import vine from '@vinejs/vine'
import { SERVICE_STATUSES } from '#constants/service'

export const createServiceValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100),
    description: vine.string().trim().maxLength(500).optional(),
    status: vine.enum(SERVICE_STATUSES).optional(),
  })
)
