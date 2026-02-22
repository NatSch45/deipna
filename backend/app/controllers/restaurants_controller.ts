import type { HttpContext } from '@adonisjs/core/http'
import Restaurant from '#models/restaurant'
import RestaurantOpeningHours from '#models/restaurant_opening_hours'
import Reservation from '#models/reservation'
import { createRestaurantValidator, updateRestaurantValidator } from '#validators/restaurant'

type OpeningHoursInput = {
  dayOfWeek: number
  openTime: string
  closeTime: string
  isClosed: boolean
}

async function saveOpeningHours(restaurantId: string, hours: OpeningHoursInput[]) {
  await RestaurantOpeningHours.query().where('restaurant_id', restaurantId).delete()
  if (hours.length > 0) {
    await RestaurantOpeningHours.createMany(
      hours.map((h) => ({
        restaurantId,
        dayOfWeek: h.dayOfWeek,
        openTime: h.openTime,
        closeTime: h.closeTime,
        isClosed: h.isClosed,
      }))
    )
  }
}

export default class RestaurantsController {
  async search({ request, response }: HttpContext) {
    const query = request.input('query', '') as string
    const city = request.input('city', '') as string
    const rawCuisineTypes = request.input('cuisineTypes')
    const rawPriceRange = request.input('priceRange', '')
    const page = Math.max(0, Number(request.input('page', 0)))
    const size = Math.min(100, Math.max(1, Number(request.input('size', 20))))

    const cuisineTypes: string[] = Array.isArray(rawCuisineTypes)
      ? rawCuisineTypes
      : rawCuisineTypes
        ? [rawCuisineTypes]
        : []

    const priceRange: string = Array.isArray(rawPriceRange)
      ? (rawPriceRange[0] ?? '')
      : (rawPriceRange ?? '')

    const dbQuery = Restaurant.query().preload('openingHours', (q) => q.orderBy('day_of_week'))

    if (query.trim()) {
      dbQuery.whereILike('name', `%${query.trim()}%`)
    }

    if (city.trim()) {
      dbQuery.whereRaw(`address->>'city' ILIKE ?`, [`%${city.trim()}%`])
    }

    if (cuisineTypes.length > 0) {
      dbQuery.where((builder) => {
        for (const ct of cuisineTypes) {
          builder.orWhereRaw(`cuisine_types @> ?::jsonb`, [JSON.stringify([ct])])
        }
      })
    }

    if (priceRange.trim()) {
      dbQuery.where('price_range', priceRange.trim())
    }

    const total = await Restaurant.query()
      .if(query.trim(), (q) => q.whereILike('name', `%${query.trim()}%`))
      .if(city.trim(), (q) => q.whereRaw(`address->>'city' ILIKE ?`, [`%${city.trim()}%`]))
      .count('* as total')
      .first()

    const totalElements = Number(total?.$extras?.total ?? 0)
    const totalPages = Math.ceil(totalElements / size)

    const restaurants = await dbQuery.offset(page * size).limit(size)

    return response.ok({
      content: restaurants,
      totalElements,
      totalPages,
      page,
      size,
    })
  }

  async mine({ authUserId, response }: HttpContext) {
    const restaurant = await Restaurant.query()
      .where('owner_id', authUserId)
      .preload('openingHours', (q) => q.orderBy('day_of_week'))
      .first()
    return response.ok(restaurant ?? null)
  }

  async show({ params, response }: HttpContext) {
    const restaurant = await Restaurant.query()
      .where('id', params.id)
      .preload('openingHours', (q) => q.orderBy('day_of_week'))
      .first()
    if (!restaurant) {
      return response.notFound({ message: `Restaurant ${params.id} not found` })
    }
    return response.ok(restaurant)
  }

  async store({ authUserId, request, response }: HttpContext) {
    const data = await request.validateUsing(createRestaurantValidator)

    const existing = await Restaurant.query().where('owner_id', authUserId).first()
    if (existing) {
      return response.conflict({ message: 'You already have a restaurant' })
    }

    const { openingHours, ...restaurantData } = data

    const restaurant = await Restaurant.create({
      ...restaurantData,
      ownerId: authUserId,
    })

    if (openingHours && openingHours.length > 0) {
      await saveOpeningHours(restaurant.id, openingHours)
    }

    await restaurant.load('openingHours', (q) => q.orderBy('day_of_week'))

    return response.created(restaurant)
  }

  async update({ authUserId, params, request, response }: HttpContext) {
    const restaurant = await Restaurant.find(params.id)

    if (!restaurant) {
      return response.notFound({ message: `Restaurant ${params.id} not found` })
    }

    if (restaurant.ownerId !== authUserId) {
      return response.forbidden({ message: 'You are not allowed to update this restaurant' })
    }

    const data = await request.validateUsing(updateRestaurantValidator)
    const { openingHours, ...restaurantData } = data

    restaurant.merge(restaurantData)
    await restaurant.save()

    if (openingHours !== undefined) {
      await saveOpeningHours(restaurant.id, openingHours)
    }

    await restaurant.load('openingHours', (q) => q.orderBy('day_of_week'))

    return response.ok(restaurant)
  }

  async destroy({ authUserId, params, response }: HttpContext) {
    const restaurant = await Restaurant.find(params.id)

    if (!restaurant) {
      return response.notFound({ message: `Restaurant ${params.id} not found` })
    }

    if (restaurant.ownerId !== authUserId) {
      return response.forbidden({ message: 'You are not allowed to delete this restaurant' })
    }

    await restaurant.delete()
    return response.noContent()
  }

  async availableSlots({ params, request, response }: HttpContext) {
    const restaurant = await Restaurant.find(params.id)
    if (!restaurant) {
      return response.notFound({ message: `Restaurant ${params.id} not found` })
    }

    const dateStr = request.input('date') as string | undefined
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return response.badRequest({ message: 'Query param "date" (YYYY-MM-DD) is required' })
    }

    const requestedDate = new Date(dateStr)
    const dayOfWeek = requestedDate.getDay()

    const hours = await RestaurantOpeningHours.query()
      .where('restaurant_id', params.id)
      .where('day_of_week', dayOfWeek)
      .first()

    if (!hours || hours.isClosed) {
      return response.ok([])
    }

    const slots: string[] = []
    const [openH, openM] = hours.openTime.split(':').map(Number)
    const [closeH, closeM] = hours.closeTime.split(':').map(Number)
    const openMinutes = openH * 60 + openM
    const closeMinutes = closeH * 60 + closeM

    for (let m = openMinutes; m < closeMinutes; m += 30) {
      const h = Math.floor(m / 60).toString().padStart(2, '0')
      const min = (m % 60).toString().padStart(2, '0')
      slots.push(`${h}:${min}`)
    }

    return response.ok(slots)
  }

  async reservations({ authUserId, params, request, response }: HttpContext) {
    const restaurant = await Restaurant.find(params.id)
    if (!restaurant) {
      return response.notFound({ message: `Restaurant ${params.id} not found` })
    }

    if (restaurant.ownerId !== authUserId) {
      return response.forbidden({ message: 'You are not allowed to view these reservations' })
    }

    const startDate = request.input('startDate') as string | undefined
    const endDate = request.input('endDate') as string | undefined
    const date = request.input('date') as string | undefined

    const query = Reservation.query()
      .where('restaurant_id', params.id)
      .orderBy('date')
      .orderBy('time')

    if (date) {
      query.where('date', date)
    } else {
      if (startDate) query.where('date', '>=', startDate)
      if (endDate) query.where('date', '<=', endDate)
    }

    const reservations = await query

    return response.ok(reservations)
  }
}
