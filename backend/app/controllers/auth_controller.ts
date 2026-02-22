import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import RefreshToken from '#models/refresh_token'
import RevokedAccessToken from '#models/revoked_access_token'
import JwtService from '#services/jwt_service'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { registerValidator, loginValidator, refreshTokenValidator } from '#validators/auth'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const { email, password, firstName, lastName, phone, role } =
      await request.validateUsing(registerValidator)

    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = await User.findBy('email', normalizedEmail)
    if (existingUser) {
      return response.conflict({ message: 'An account with this email already exists' })
    }

    const user = await User.create({
      email: normalizedEmail,
      password: await hash.use('scrypt').make(password),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim() || null,
      role: role || 'CUSTOMER',
    })

    const token = await JwtService.generateAccessToken(user)
    const refreshTokenValue = await JwtService.generateRefreshToken(user)

    await RefreshToken.create({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt: DateTime.now().plus({ days: 7 }),
      revoked: false,
    })

    return response.created({
      token,
      refreshToken: refreshTokenValue,
      user: this.toUserResponse(user),
    })
  }

  async login({ request, response, logger }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    logger.info('Login attempt started with email: ' + email)

    const normalizedEmail = email.trim().toLowerCase()
    const user = await User.findBy('email', normalizedEmail)
    if (!user) {
      logger.warn({ email: normalizedEmail }, 'Login failed: user not found')
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const isValid = await hash.use('scrypt').verify(user.password, password)
    if (!isValid) {
      logger.warn({ email: normalizedEmail }, 'Login failed: invalid password')
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const token = await JwtService.generateAccessToken(user)
    const refreshTokenValue = await JwtService.generateRefreshToken(user)

    await RefreshToken.create({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt: DateTime.now().plus({ days: 7 }),
      revoked: false,
    })

    return response.ok({
      token,
      refreshToken: refreshTokenValue,
      user: this.toUserResponse(user),
    })
  }

  async me({ authUserId, response }: HttpContext) {
    const userModel = await User.find(authUserId)
    if (!userModel) {
      return response.notFound({ message: 'User not found' })
    }
    return response.ok(this.toUserResponse(userModel))
  }

  async logout({ authUserId, request, response }: HttpContext) {
    const userId = authUserId
    const token = request.header('authorization')?.replace('Bearer ', '')

    if (userId) {
      await RefreshToken.query().where('user_id', userId).delete()
    }

    if (token) {
      const payload = await JwtService.verifyAccessToken(token)
      if (payload) {
        await RevokedAccessToken.create({
          jti: payload.jti,
          expiresAt: DateTime.now().plus({ minutes: 15 }),
        })
      }
    }

    return response.noContent()
  }

  async refresh({ request, response }: HttpContext) {
    const { refreshToken } = await request.validateUsing(refreshTokenValidator)

    const payload = await JwtService.verifyRefreshToken(refreshToken)
    if (!payload) {
      return response.unauthorized({ message: 'Invalid or expired refresh token' })
    }

    const storedToken = await RefreshToken.query()
      .where('token', refreshToken)
      .where('revoked', false)
      .first()

    if (!storedToken || storedToken.expiresAt < DateTime.now()) {
      if (storedToken) {
        storedToken.revoked = true
        await storedToken.save()
      }
      return response.unauthorized({ message: 'Invalid or expired refresh token' })
    }

    const user = await User.findOrFail(payload.sub)

    storedToken.revoked = true
    await storedToken.save()

    const token = await JwtService.generateAccessToken(user)
    const refreshTokenValue = await JwtService.generateRefreshToken(user)

    await RefreshToken.create({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt: DateTime.now().plus({ days: 7 }),
      revoked: false,
    })

    return response.ok({
      token,
      refreshToken: refreshTokenValue,
      user: this.toUserResponse(user),
    })
  }

  private toUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt.toISO(),
      updatedAt: user.updatedAt.toISO(),
    }
  }
}
