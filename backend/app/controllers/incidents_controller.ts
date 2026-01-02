import type { HttpContext } from '@adonisjs/core/http'
import IncidentService from '#services/IncidentService'
import { createIncidentValidator } from '#validators/incident'

export default class IncidentsController {
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createIncidentValidator)

    const incident = await IncidentService.createIncident(payload)

    return response.created({
      message: 'The incident was successfully logged and the service status was updated.',
      data: incident,
    })
  }

  async index({ response }: HttpContext) {
    const incidents = await IncidentService.listIncidents()
    return response.ok({ data: incidents })
  }
}
