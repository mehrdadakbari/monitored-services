import Service from '#models/service'
import type { ServiceStatus } from '#constants/service'

interface CreateServicePayload {
  name: string
  description?: string | null
  status?: ServiceStatus
}

export default class ServiceService {
  static async listServices() {
    return Service.query().preload('incidents')
  }

  static async createService(payload: CreateServicePayload) {
    return Service.create(payload)
  }

  static async getServiceById(id: number) {
    return Service.query().where('id', id).preload('incidents').firstOrFail()
  }
}
