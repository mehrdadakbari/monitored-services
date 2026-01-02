import type { HttpContext } from '@adonisjs/core/http'
import ServiceService from '#services/ServiceService'
import { createServiceValidator } from '#validators/service'

export default class ServicesController {
  async index({ response }: HttpContext) {
    const services = await ServiceService.listServices()
    return response.ok({ data: services })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createServiceValidator)

    const service = await ServiceService.createService(payload)
    return response.created({ data: service })
  }

  async show({ params, response }: HttpContext) {
    const service = await ServiceService.getServiceById(Number(params.id))
    return response.ok({ data: service })
  }
}
