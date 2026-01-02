import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const ServicesController = () => import('#controllers/services_controller')
const IncidentsController = () => import('#controllers/incidents_controller')

router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
    router.get('/services', [ServicesController, 'index'])
  })
  .prefix('/api')

router
  .group(() => {
    router.post('/incidents', [IncidentsController, 'store'])
    router.get('/incidents', [IncidentsController, 'index'])
    router.post('/services', [ServicesController, 'store'])
    router.post('/logout', [AuthController, 'logout'])
  })
  .prefix('/api/admin')
  .use(middleware.auth())
