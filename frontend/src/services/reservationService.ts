import api from './api'
import type { Reservation, CreateReservationRequest } from '@/types/reservation'

export const reservationService = {
  async getMyReservations(): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>('/reservations/my')
    return response.data
  },

  async getById(id: string): Promise<Reservation> {
    const response = await api.get<Reservation>(`/reservations/${id}`)
    return response.data
  },

  async create(data: CreateReservationRequest): Promise<Reservation> {
    const response = await api.post<Reservation>('/reservations', data)
    return response.data
  },

  async cancel(id: string): Promise<void> {
    await api.delete(`/reservations/${id}`)
  },

  async updateStatus(id: string, status: string): Promise<Reservation> {
    const response = await api.patch<Reservation>(`/reservations/${id}/status`, { status })
    return response.data
  },

  async getAvailableSlots(restaurantId: string, date: string): Promise<string[]> {
    const response = await api.get<string[]>(`/restaurants/${restaurantId}/available-slots`, {
      params: { date },
    })
    return response.data
  },

  async getRestaurantReservations(
    restaurantId: string,
    startDate: string,
    endDate: string
  ): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>(`/restaurants/${restaurantId}/reservations`, {
      params: { startDate, endDate },
    })
    return response.data
  },
}
