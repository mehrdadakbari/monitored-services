import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/auth'
import AuthService from '#services/AuthService'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const result = await AuthService.login(payload.email, payload.password)

    if (!result) {
      return response.unauthorized({ errors: [{ message: 'Email or password is incorrect.' }] })
    }

    return response.ok({
      type: 'Bearer',
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName
      }
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    await AuthService.logout(user)
    return response.ok({ message: 'You have successfully logged out' })
  }
}
