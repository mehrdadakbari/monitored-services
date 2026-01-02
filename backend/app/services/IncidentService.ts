import Incident from '#models/incident'
import Service from '#models/service'
import type { IncidentStatus } from '#constants/incident'

interface CreateIncidentPayload {
  serviceId: number
  title: string
  message: string
  status: IncidentStatus
}

export default class IncidentService {
  static async createIncident(payload: CreateIncidentPayload) {
    const incident = await Incident.create(payload)

    const service = await Service.findOrFail(payload.serviceId)

    if (payload.status !== 'resolved') {
      service.setStatus('down')
      await service.save()
    }

    return incident
  }

  static async listIncidents(limit = 20) {
    return Incident.query()
      .preload('service')
      .orderBy('createdAt', 'desc')
      .limit(limit)
  }
}
