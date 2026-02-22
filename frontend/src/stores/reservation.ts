import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reservation, CreateReservationRequest } from '@/types/reservation'
import { reservationService } from '@/services/reservationService'

export const useReservationStore = defineStore('reservation', () => {
  const reservations = ref<Reservation[]>([])
  const availableSlots = ref<string[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const upcomingReservations = computed(() =>
    reservations.value
      .filter((r) => new Date(r.date) >= new Date() && r.status !== 'CANCELLED')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  )

  const pastReservations = computed(() =>
    reservations.value
      .filter((r) => new Date(r.date) < new Date() || r.status === 'COMPLETED')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  )

  async function fetchMyReservations() {
    isLoading.value = true
    error.value = null

    try {
      reservations.value = await reservationService.getMyReservations()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch reservations'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createReservation(data: CreateReservationRequest) {
    isLoading.value = true
    error.value = null

    try {
      const reservation = await reservationService.create(data)
      reservations.value.push(reservation)
      return reservation
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to create reservation'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function cancelReservation(id: string) {
    isLoading.value = true
    error.value = null

    try {
      await reservationService.cancel(id)
      const index = reservations.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        reservations.value[index].status = 'CANCELLED'
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to cancel reservation'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAvailableSlots(restaurantId: string, date: string) {
    isLoading.value = true
    error.value = null

    try {
      availableSlots.value = await reservationService.getAvailableSlots(restaurantId, date)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch available slots'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    reservations,
    availableSlots,
    isLoading,
    error,
    upcomingReservations,
    pastReservations,
    fetchMyReservations,
    createReservation,
    cancelReservation,
    fetchAvailableSlots,
  }
})
