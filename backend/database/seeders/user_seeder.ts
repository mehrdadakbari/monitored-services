import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreate({
      email: 'admin@admin.com',
    }, {
      fullName: 'Admin User',
      email: 'admin@admin.com',
      password: 'admin123',
    })
  }
}
