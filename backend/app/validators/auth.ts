import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
    firstName: vine.string().trim().minLength(1),
    lastName: vine.string().trim().minLength(1),
    phone: vine.string().trim().optional(),
    role: vine.enum(['CUSTOMER', 'RESTAURANT_OWNER', 'ADMIN']).optional(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(1),
  })
)

export const refreshTokenValidator = vine.compile(
  vine.object({
    refreshToken: vine.string().minLength(1),
  })
)
