export interface Reservation {
  id: string
  restaurantId: string
  restaurantName?: string
  userId?: string | null
  tableId?: string
  tableName?: string
  date: string
  time: string
  partySize: number
  status: ReservationStatus
  guestInfo?: GuestInfo
  notes?: string
  createdAt: string
  updatedAt: string
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'

export interface GuestInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface CreateReservationRequest {
  restaurantId: string
  date: string
  time: string
  partySize: number
  notes?: string
  guestInfo?: GuestInfo
}

export interface ReservationSlot {
  time: string
  availableTables: AvailableTable[]
}

export interface AvailableTable {
  id: string
  name: string
  capacity: number
  specialPrice?: number
  promotion?: number
}
