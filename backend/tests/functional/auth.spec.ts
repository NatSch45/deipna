import { test } from '@japa/runner'

test.group('Auth API', (group) => {
  group.each.setup(async () => {
    const { default: db } = await import('@adonisjs/lucid/services/db')
    await db.rawQuery('TRUNCATE refresh_tokens, revoked_access_tokens, users CASCADE')
  })

  test('POST /api/auth/register creates user and returns tokens', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    })

    response.assertStatus(201)
    response.assertBodyContains({
      token: response.body().token,
      refreshToken: response.body().refreshToken,
      user: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'CUSTOMER',
      },
    })
  })

  test('POST /api/auth/login returns tokens for valid credentials', async ({ client }) => {
    await client.post('/api/auth/register').json({
      email: 'login@example.com',
      password: 'password123',
      firstName: 'Login',
      lastName: 'Test',
    })

    const response = await client.post('/api/auth/login').json({
      email: 'login@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      user: { email: 'login@example.com' },
    })
  })

  test('GET /api/auth/me returns user when authenticated', async ({ client }) => {
    const registerResponse = await client.post('/api/auth/register').json({
      email: 'me@example.com',
      password: 'password123',
      firstName: 'Me',
      lastName: 'Test',
    })

    const token = registerResponse.body().token
    const response = await client.get('/api/auth/me').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      email: 'me@example.com',
      firstName: 'Me',
      lastName: 'Test',
    })
  })

  test('GET /api/auth/me returns 401 when not authenticated', async ({ client }) => {
    const response = await client.get('/api/auth/me')
    response.assertStatus(401)
  })
})
