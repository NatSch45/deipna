import vine from '@vinejs/vine'

const guestInfoSchema = vine.object({
  firstName: vine.string().trim().minLength(1),
  lastName: vine.string().trim().minLength(1),
  email: vine.string().email(),
  phone: vine.string().trim().minLength(1),
})

export const createReservationValidator = vine.compile(
  vine.object({
    restaurantId: vine.string().uuid(),
    date: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: vine.string().regex(/^\d{2}:\d{2}$/),
    partySize: vine.number().min(1).max(100),
    notes: vine.string().trim().optional(),
    guestInfo: guestInfoSchema.optional(),
  })
)
