import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Service from '#models/service'
import Incident from '#models/incident'
import logger from '@adonisjs/core/services/logger'

export default class SimulateIncidents extends BaseCommand {
  static commandName = 'simulate:incidents'
  static description = 'Random Incident Simulator and Service Status Update'

  static options: CommandOptions = {
    startApp: true
  }

  async run() {
    logger.info('Incident simulation job started')

    const incidents = await Incident.all()
    const services = await Service.all()

    for (const incident of incidents) {
      if (incident.status !== 'resolved') {
        if (Math.random() > 0.7) {
          incident.status = 'resolved'
          await incident.save()

          logger.info(`Incident "${incident.title}" resolved`)
        }
      }
    }

    for (const service of services) {
      const serviceIncidents = incidents.filter(
        (i) => String(i.serviceId) === String(service.id) && i.status !== 'resolved'
      )

      let newStatus: 'operational' | 'down' = 'operational'

      if (serviceIncidents.length > 0) {
        newStatus = Math.random() > 0.5 ? 'operational' : 'down'
      }

      if (service.status !== newStatus) {
        service.status = newStatus
        await service.save()

        logger.info(`Service "${service.name}" changed to ${newStatus}`)
      }
    }
  }
}
