import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  beforeCreate,
} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Service from '#models/service'
import type { IncidentStatus } from '#constants/incident'

export default class Incident extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'service_id' })
  declare serviceId: number

  @column()
  declare title: string

  @column()
  declare message: string

  @column()
  declare status: IncidentStatus

  @belongsTo(() => Service)
  declare service: BelongsTo<typeof Service>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static setDefaultStatus(incident: Incident) {
    incident.status ??= 'investigating'
  }
}
