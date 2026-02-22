import api from './api'
import type { Restaurant, RestaurantSearchParams, RestaurantSearchResponse } from '@/types/restaurant'

export const restaurantService = {
  async getMine(): Promise<Restaurant | null> {
    const response = await api.get<Restaurant | null>('/restaurants/mine')
    return response.data
  },

  async search(params: RestaurantSearchParams): Promise<RestaurantSearchResponse> {
    const response = await api.get<RestaurantSearchResponse>('/restaurants/search', { params })
    return response.data
  },

  async getById(id: string): Promise<Restaurant> {
    const response = await api.get<Restaurant>(`/restaurants/${id}`)
    return response.data
  },

  async create(data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await api.post<Restaurant>('/restaurants', data)
    return response.data
  },

  async update(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await api.put<Restaurant>(`/restaurants/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/restaurants/${id}`)
  },
}
