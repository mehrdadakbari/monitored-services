import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthMiddleware {
  async handle({ auth }: HttpContext, next: NextFn) {
    await auth.use('api').authenticate()
    return next()
  }
}
