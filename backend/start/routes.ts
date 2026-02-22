/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import app from '@adonisjs/core/services/app'

const authController = () => import('#controllers/auth_controller')
const restaurantsController = () => import('#controllers/restaurants_controller')
const reservationsController = () => import('#controllers/reservations_controller')

router.get('/', async () => ({ hello: 'world' }))

// Documentation Swagger (fichier manuel swagger.yaml)
router.get('/docs', async ({ response }) => {
  const { readFileSync } = await import('node:fs')
  const { join } = await import('node:path')
  const yaml = readFileSync(join(app.makePath('swagger.yaml')), 'utf-8')
  return response.header('Content-Type', 'application/x-yaml').send(yaml)
})
router.get('/docs/ui', async ({ response }) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Deipna API - Swagger</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/docs',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis],
    })
  </script>
</body>
</html>`
  return response.header('Content-Type', 'text/html').send(html)
})

router
  .group(() => {
    router.get('/health', async () => ({ status: 'ok' }))

    router
      .group(() => {
        router.post('/register', [authController, 'register'])
        router.post('/login', [authController, 'login'])
        router.post('/refresh', [authController, 'refresh'])
        router.get('/me', [authController, 'me']).use(middleware.auth())
        router.post('/logout', [authController, 'logout']).use(middleware.auth())
      })
      .prefix('/auth')

    router
      .group(() => {
        router.get('/search', [restaurantsController, 'search'])
        router.get('/mine', [restaurantsController, 'mine']).use(middleware.auth())
        router.get('/:id', [restaurantsController, 'show'])
        router.post('/', [restaurantsController, 'store']).use(middleware.auth())
        router.put('/:id', [restaurantsController, 'update']).use(middleware.auth())
        router.delete('/:id', [restaurantsController, 'destroy']).use(middleware.auth())
        router.get('/:id/available-slots', [restaurantsController, 'availableSlots'])
        router
          .get('/:id/reservations', [restaurantsController, 'reservations'])
          .use(middleware.auth())
      })
      .prefix('/restaurants')

    router
      .group(() => {
        router.get('/my', [reservationsController, 'my']).use(middleware.auth())
        router.get('/:id', [reservationsController, 'show']).use(middleware.auth())
        router.post('/', [reservationsController, 'store'])
        router.patch('/:id/status', [reservationsController, 'updateStatus']).use(middleware.auth())
        router.delete('/:id', [reservationsController, 'destroy']).use(middleware.auth())
      })
      .prefix('/reservations')
  })
  .prefix('/api')
