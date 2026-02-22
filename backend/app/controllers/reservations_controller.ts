import type { HttpContext } from '@adonisjs/core/http'
import Reservation from '#models/reservation'
import Restaurant from '#models/restaurant'
import User from '#models/user'
import JwtService from '#services/jwt_service'
import RevokedAccessToken from '#models/revoked_access_token'
import { createReservationValidator } from '#validators/reservation'

const OWNER_ALLOWED_STATUSES = ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'] as const
type OwnerStatus = (typeof OWNER_ALLOWED_STATUSES)[number]

export default class ReservationsController {
  async my({ authUserId, response }: HttpContext) {
    const reservations = await Reservation.query()
      .where('user_id', authUserId)
      .orderBy('date', 'desc')
      .orderBy('time', 'desc')

    return response.ok(reservations)
  }

  async show({ authUserId, params, response }: HttpContext) {
    const reservation = await Reservation.find(params.id)
    if (!reservation) {
      return response.notFound({ message: `Reservation ${params.id} not found` })
    }

    if (reservation.userId !== authUserId) {
      return response.forbidden({ message: 'You are not allowed to view this reservation' })
    }

    return response.ok(reservation)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createReservationValidator)

    let userId: string | null = null
    let guestInfo = data.guestInfo ?? null

    // Optionally resolve the authenticated user from the token
    const authHeader = request.header('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (token) {
      const payload = await JwtService.verifyAccessToken(token)
      if (payload) {
        const isRevoked = await RevokedAccessToken.find(payload.jti)
        if (!isRevoked) {
          userId = payload.sub

          if (!guestInfo) {
            const fullUser = await User.find(userId)
            if (fullUser) {
              guestInfo = {
                firstName: fullUser.firstName,
                lastName: fullUser.lastName,
                email: fullUser.email,
                phone: fullUser.phone ?? '',
              }
            }
          }
        }
      }
    }

    if (!guestInfo) {
      return response.badRequest({
        message: 'guestInfo (firstName, lastName, email, phone) is required for guest bookings',
      })
    }

    const reservation = await Reservation.create({
      restaurantId: data.restaurantId,
      userId,
      date: data.date,
      time: data.time,
      partySize: data.partySize,
      notes: data.notes ?? null,
      guestInfo,
      status: 'PENDING',
    })

    return response.created(reservation)
  }

  async updateStatus({ authUserId, params, request, response }: HttpContext) {
    const reservation = await Reservation.find(params.id)
    if (!reservation) {
      return response.notFound({ message: `Reservation ${params.id} not found` })
    }

    const restaurant = await Restaurant.find(reservation.restaurantId)
    if (!restaurant || restaurant.ownerId !== authUserId) {
      return response.forbidden({ message: 'You are not the owner of this restaurant' })
    }

    const status = request.input('status') as string
    if (!OWNER_ALLOWED_STATUSES.includes(status as OwnerStatus)) {
      return response.badRequest({
        message: `Status must be one of: ${OWNER_ALLOWED_STATUSES.join(', ')}`,
      })
    }

    reservation.status = status as OwnerStatus
    await reservation.save()

    return response.ok(reservation)
  }

  async destroy({ authUserId, params, response }: HttpContext) {
    const reservation = await Reservation.find(params.id)
    if (!reservation) {
      return response.notFound({ message: `Reservation ${params.id} not found` })
    }

    if (reservation.userId !== authUserId) {
      return response.forbidden({ message: 'You are not allowed to cancel this reservation' })
    }

    reservation.status = 'CANCELLED'
    await reservation.save()

    return response.ok(reservation)
  }
}
