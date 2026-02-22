import { test } from '@japa/runner'

test.group('Health API', () => {
  test('GET /api/health returns status ok', async ({ client }) => {
    const response = await client.get('/api/health')
    response.assertStatus(200)
    response.assertBody({ status: 'ok' })
  })
})
