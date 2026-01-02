import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthService {
  static async login(email: string, password: string) {
    const user = await User.findBy('email', email)
    if (!user) return null

    const isValid = await hash.verify(user.password, password)
    if (!isValid) return null

    const token = await User.accessTokens.create(user)
    return { user, token }
  }

  static async logout(user: User) {
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
  }
}
