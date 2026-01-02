import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasMany,
  beforeCreate,
} from '@adonisjs/lucid/orm'
import Incident from '#models/incident'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { ServiceStatus } from '#constants/service'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare status: ServiceStatus

  @hasMany(() => Incident)
  declare incidents: HasMany<typeof Incident>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static setDefaultStatus(service: Service) {
    service.status ??= 'operational'
  }

  setStatus(status: ServiceStatus) {
    this.status = status
  }
}
