import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Service from '#models/service'
import logger from '@adonisjs/core/services/logger'

export default class SimulateIncidents extends BaseCommand {
  static commandName = 'simulate:incidents'
  static description = 'Simulate incidents and update service status based on relations'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    logger.info('Incident simulation job started')

    const services = await Service.query().preload('incidents')

    for (const service of services) {
      const incidents = service.incidents

      if (incidents.length === 0) {
        if (service.status !== 'operational') {
          service.status = 'operational'
          await service.save()
          logger.info(`Service "${service.name}" set to operational (no incidents)`)
        }
        continue
      }

      for (const incident of incidents) {
        if (incident.status !== 'resolved' && Math.random() > 0.7) {
          incident.status = 'resolved'
          await incident.save()
          logger.info(`Incident "${incident.title}" resolved`)
        }
      }

      const hasActiveIncidents = incidents.some(
        (incident) => incident.status !== 'resolved'
      )

      const newStatus: 'operational' | 'down' = hasActiveIncidents
        ? 'down'
        : 'operational'

      if (service.status !== newStatus) {
        service.status = newStatus
        await service.save()
        logger.info(`Service "${service.name}" changed to ${newStatus}`)
      }
    }

    logger.info('Incident simulation job finished')
  }
}
