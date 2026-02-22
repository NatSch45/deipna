import env from '#start/env'
import * as jose from 'jose'
import type User from '#models/user'

const ACCESS_TOKEN_EXPIRATION = '15m'
const REFRESH_TOKEN_EXPIRATION = '7d'

export default class JwtService {
  private static getSecret(): Uint8Array {
    return new TextEncoder().encode(env.get('JWT_SECRET'))
  }

  static async generateAccessToken(user: User): Promise<string> {
    const secret = this.getSecret()
    return await new jose.SignJWT({
      sub: user.id,
      type: 'access',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(crypto.randomUUID())
      .setIssuedAt()
      .setExpirationTime(ACCESS_TOKEN_EXPIRATION)
      .sign(secret)
  }

  static async generateRefreshToken(user: User): Promise<string> {
    const secret = this.getSecret()
    return await new jose.SignJWT({
      sub: user.id,
      type: 'refresh',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(crypto.randomUUID())
      .setIssuedAt()
      .setExpirationTime(REFRESH_TOKEN_EXPIRATION)
      .sign(secret)
  }

  static async verifyAccessToken(token: string): Promise<{ sub: string; jti: string } | null> {
    try {
      const secret = this.getSecret()
      const { payload } = await jose.jwtVerify(token, secret)
      if (payload.type !== 'access') return null
      return {
        sub: payload.sub as string,
        jti: payload.jti as string,
      }
    } catch {
      return null
    }
  }

  static async verifyRefreshToken(token: string): Promise<{ sub: string } | null> {
    try {
      const secret = this.getSecret()
      const { payload } = await jose.jwtVerify(token, secret)
      if (payload.type !== 'refresh') return null
      return { sub: payload.sub as string }
    } catch {
      return null
    }
  }
}
