import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Restaurant, RestaurantSearchParams, RestaurantSearchResponse } from '@/types/restaurant'
import { restaurantService } from '@/services/restaurantService'

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurants = ref<Restaurant[]>([])
  const currentRestaurant = ref<Restaurant | null>(null)
  const myRestaurant = ref<Restaurant | null>(null)
  const searchResults = ref<RestaurantSearchResponse | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function searchRestaurants(params: RestaurantSearchParams) {
    isLoading.value = true
    error.value = null

    try {
      searchResults.value = await restaurantService.search(params)
      restaurants.value = searchResults.value.content
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Search failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchRestaurant(id: string) {
    isLoading.value = true
    error.value = null

    try {
      currentRestaurant.value = await restaurantService.getById(id)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch restaurant'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMyRestaurant() {
    isLoading.value = true
    error.value = null

    try {
      myRestaurant.value = await restaurantService.getMine()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch your restaurant'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createRestaurant(data: Partial<Restaurant>) {
    isLoading.value = true
    error.value = null

    try {
      myRestaurant.value = await restaurantService.create(data)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to create restaurant'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateRestaurant(id: string, data: Partial<Restaurant>) {
    isLoading.value = true
    error.value = null

    try {
      myRestaurant.value = await restaurantService.update(id, data)
      currentRestaurant.value = myRestaurant.value
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to update restaurant'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function clearSearch() {
    searchResults.value = null
    restaurants.value = []
  }

  return {
    restaurants,
    currentRestaurant,
    myRestaurant,
    searchResults,
    isLoading,
    error,
    searchRestaurants,
    fetchRestaurant,
    fetchMyRestaurant,
    createRestaurant,
    updateRestaurant,
    clearSearch,
  }
})
