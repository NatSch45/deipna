import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import JwtService from '#services/jwt_service'
import RevokedAccessToken from '#models/revoked_access_token'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    authUserId: string
  }
}

export default class JwtAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return ctx.response.unauthorized({ message: 'Missing or invalid authorization header' })
    }

    const payload = await JwtService.verifyAccessToken(token)
    if (!payload) {
      return ctx.response.unauthorized({ message: 'Invalid or expired token' })
    }

    const isRevoked = await RevokedAccessToken.find(payload.jti)
    if (isRevoked) {
      return ctx.response.unauthorized({ message: 'Token has been revoked' })
    }

    ctx.authUserId = payload.sub
    return next()
  }
}
