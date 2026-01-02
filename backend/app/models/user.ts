import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, beforeSave } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  static accessTokens = DbAccessTokensProvider.forModel(User)

  public async setPassword(plainPassword: string) {
    this.password = await hash.make(plainPassword)
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password && !user.password.startsWith('$2b$')) {
      user.password = await hash.make(user.password)
    }
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
