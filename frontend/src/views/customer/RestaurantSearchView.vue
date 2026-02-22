<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRestaurantStore } from '@/stores/restaurant'
  import type { RestaurantSearchParams, CuisineType, PriceRange } from '@/types/restaurant'
  import BaseInput from '@/components/common/BaseInput.vue'
  import BaseButton from '@/components/common/BaseButton.vue'
  import BaseCard from '@/components/common/BaseCard.vue'
  import BaseMultiSelect from '@/components/common/BaseMultiSelect.vue'
  import BasePagination from '@/components/common/BasePagination.vue'
  import { RouterLink } from 'vue-router'

  const restaurantStore = useRestaurantStore()

  const searchQuery = ref('')
  const selectedCuisines = ref<CuisineType[]>([])
  const selectedPriceRanges = ref<PriceRange[]>([])
  const city = ref('')
  const currentPage = ref(0)
  const pageSize = ref(9)

  const cuisineTypes: { value: CuisineType; label: string }[] = [
    { value: 'FRENCH', label: 'Français' },
    { value: 'ITALIAN', label: 'Italien' },
    { value: 'JAPANESE', label: 'Japonais' },
    { value: 'CHINESE', label: 'Chinois' },
    { value: 'INDIAN', label: 'Indien' },
    { value: 'MEXICAN', label: 'Mexicain' },
    { value: 'THAI', label: 'Thaïlandais' },
    { value: 'MEDITERRANEAN', label: 'Méditerranéen' },
    { value: 'AMERICAN', label: 'Américain' },
    { value: 'OTHER', label: 'Autre' },
  ]

  const priceRanges: { value: PriceRange; label: string; icon: string }[] = [
    { value: 'BUDGET', label: 'Budget', icon: '€' },
    { value: 'MODERATE', label: 'Modéré', icon: '€€' },
    { value: 'UPSCALE', label: 'Haut de gamme', icon: '€€€' },
    { value: 'FINE_DINING', label: 'Gastronomique', icon: '€€€€' },
  ]

  function getPriceRangeLabel(value: PriceRange | null | undefined): string {
    if (!value) return ''
    return priceRanges.find((p) => p.value === value)?.icon ?? ''
  }

  function getCuisineLabel(value: CuisineType): string {
    return cuisineTypes.find((c) => c.value === value)?.label ?? value
  }

  async function fetchPage(page: number) {
    currentPage.value = page
    const params: RestaurantSearchParams = {
      query: searchQuery.value || undefined,
      city: city.value || undefined,
      cuisineTypes: selectedCuisines.value.length > 0 ? selectedCuisines.value : undefined,
      priceRange: selectedPriceRanges.value.length > 0 ? selectedPriceRanges.value : undefined,
      page,
      size: pageSize.value,
    }
    await restaurantStore.searchRestaurants(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSearch() {
    currentPage.value = 0
    await fetchPage(0)
  }

  async function handlePageSizeChange(size: number) {
    pageSize.value = size
    currentPage.value = 0
    await fetchPage(0)
  }

  function resetFilters() {
    searchQuery.value = ''
    city.value = ''
    selectedCuisines.value = []
    selectedPriceRanges.value = []
    handleSearch()
  }

  const hasActiveFilters = () =>
    !!searchQuery.value ||
    !!city.value ||
    selectedCuisines.value.length > 0 ||
    selectedPriceRanges.value.length > 0

  onMounted(() => {
    handleSearch()
  })
</script>

<template>
  <div class="search-page">
    <h1>Rechercher un restaurant</h1>

    <BaseCard class="search-filters">
      <form @submit.prevent="handleSearch">
        <div class="filters-row">
          <BaseInput
            id="search"
            v-model="searchQuery"
            type="search"
            placeholder="Nom du restaurant..."
          />

          <BaseInput id="city" v-model="city" placeholder="Ville..." />

          <BaseMultiSelect
            v-model="selectedCuisines"
            :options="cuisineTypes"
            placeholder="Type de cuisine"
          />

          <BaseMultiSelect
            v-model="selectedPriceRanges"
            :options="priceRanges.map((r) => ({ value: r.value, label: `${r.icon} — ${r.label}` }))"
            placeholder="Gamme de prix"
          />
        </div>

        <div class="filters-actions">
          <BaseButton type="submit" variant="primary" :loading="restaurantStore.isLoading">
            Rechercher
          </BaseButton>
          <button
            v-if="hasActiveFilters()"
            type="button"
            class="reset-btn"
            @click="resetFilters"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </form>
    </BaseCard>

    <div v-if="restaurantStore.isLoading" class="loading">Chargement...</div>

    <template v-else>
      <div v-if="restaurantStore.restaurants.length === 0" class="no-results">
        <p>Aucun restaurant trouvé. Essayez d'élargir vos critères de recherche.</p>
      </div>

      <div v-else class="results-grid">
        <RouterLink
          v-for="restaurant in restaurantStore.restaurants"
          :key="restaurant.id"
          :to="`/restaurants/${restaurant.id}`"
          class="restaurant-link"
        >
          <BaseCard hoverable>
            <div class="restaurant-card">
              <div class="restaurant-image">
                <img
                  v-if="restaurant.photos && restaurant.photos.length > 0"
                  :src="restaurant.photos[0]"
                  :alt="restaurant.name"
                />
                <div v-else class="no-image">Pas d'image</div>
              </div>
              <div class="restaurant-info">
                <div class="card-header-row">
                  <h3>{{ restaurant.name }}</h3>
                  <span v-if="restaurant.priceRange" class="price-badge">
                    {{ getPriceRangeLabel(restaurant.priceRange) }}
                  </span>
                </div>
                <div v-if="restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0" class="cuisine-tags">
                  <span v-for="type in restaurant.cuisineTypes" :key="type" class="cuisine-tag">
                    {{ getCuisineLabel(type) }}
                  </span>
                </div>
                <div class="card-meta">
                  <span v-if="restaurant.address" class="meta-location">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                    </svg>
                    {{ restaurant.address.city }}
                  </span>
                  <span v-if="restaurant.averageRating" class="meta-rating">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    {{ restaurant.averageRating.toFixed(1) }}
                  </span>
                </div>
              </div>
            </div>
          </BaseCard>
        </RouterLink>
      </div>

      <BasePagination
        v-if="restaurantStore.searchResults"
        :current-page="currentPage"
        :total-pages="restaurantStore.searchResults.totalPages"
        :total-elements="restaurantStore.searchResults.totalElements"
        :page-size="pageSize"
        @update:current-page="fetchPage"
        @update:page-size="handlePageSizeChange"
      />
    </template>
  </div>
</template>

<style scoped>
  .search-page {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  h1 {
    text-align: center;
    color: var(--color-primary);
  }

  .search-filters {
    position: sticky;
    top: 80px;
    z-index: 10;
    background: var(--color-background);
  }

  .filters-row {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
    align-items: flex-end;
    margin-bottom: var(--spacing-md);
  }

  .filters-row > * {
    flex: 1;
    min-width: 180px;
  }


  .filters-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .reset-btn {
    background: none;
    border: none;
    color: var(--color-text-light);
    font-size: 0.875rem;
    cursor: pointer;
    padding: var(--spacing-xs) var(--spacing-sm);
    text-decoration: underline;
  }

  .reset-btn:hover {
    color: var(--color-danger);
  }

  .loading,
  .no-results {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--color-text-light);
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: var(--spacing-lg);
  }

  .restaurant-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    width: 100%;
  }

  .restaurant-link :deep(.card) {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .restaurant-link :deep(.card-body) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .restaurant-card {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .restaurant-image {
    height: 180px;
    background-color: var(--color-background-soft);
    border-radius: var(--border-radius);
    overflow: hidden;
    margin-bottom: var(--spacing-md);
  }

  .restaurant-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
  }

  .card-header-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
  }

  .card-header-row h3 {
    color: var(--color-text);
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .price-badge {
    font-weight: 700;
    color: var(--color-secondary-dark);
    font-size: 1.1rem;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .cuisine-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-xs);
  }

  .cuisine-tag {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 999px;
    background-color: color-mix(in srgb, var(--color-primary) 12%, transparent);
    color: var(--color-primary);
    font-size: 0.78rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .restaurant-info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: var(--spacing-sm);
    border-top: 1px solid var(--color-border-light);
  }

  .meta-location,
  .meta-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .meta-location {
    color: var(--color-text-light);
  }

  .meta-rating {
    color: var(--color-secondary-dark);
  }

  .meta-rating svg {
    color: #f59e0b;
  }
</style>
