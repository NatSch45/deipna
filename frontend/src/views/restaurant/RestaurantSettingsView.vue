<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useRestaurantStore } from '@/stores/restaurant'
import type { CuisineType, PriceRange, RestaurantFeature, OpeningHours } from '@/types/restaurant'

 const restaurantStore = useRestaurantStore()

 // Form state
 const name = ref('')
 const description = ref('')
 const phone = ref('')
 const email = ref('')
 const street = ref('')
 const city = ref('')
 const postalCode = ref('')
const cuisineTypes = ref<CuisineType[]>([])
const priceRange = ref<PriceRange | null>(null)
const features = ref<RestaurantFeature[]>([])

const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

function defaultOpeningHours(): OpeningHours[] {
  return Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    openTime: '12:00',
    closeTime: '22:00',
    isClosed: i === 0,
  }))
}

const openingHours = ref<OpeningHours[]>(defaultOpeningHours())

 const successMessage = ref<string | null>(null)
 const errorMessage = ref<string | null>(null)

 const cuisineOptions: { value: CuisineType; label: string; icon: string }[] = [
   { value: 'FRENCH', label: 'Français', icon: '🥐' },
   { value: 'ITALIAN', label: 'Italien', icon: '🍕' },
   { value: 'JAPANESE', label: 'Japonais', icon: '🍣' },
   { value: 'CHINESE', label: 'Chinois', icon: '🥢' },
   { value: 'INDIAN', label: 'Indien', icon: '🍛' },
   { value: 'MEXICAN', label: 'Mexicain', icon: '🌮' },
   { value: 'THAI', label: 'Thaïlandais', icon: '🍜' },
   { value: 'MEDITERRANEAN', label: 'Méditerranéen', icon: '🫒' },
   { value: 'AMERICAN', label: 'Américain', icon: '🍔' },
   { value: 'OTHER', label: 'Autre', icon: '🍽️' },
 ]

 const priceOptions: { value: PriceRange; label: string; symbol: string; description: string }[] = [
   { value: 'BUDGET', label: 'Budget', symbol: '€', description: 'Moins de 15€ par personne' },
   { value: 'MODERATE', label: 'Intermédiaire', symbol: '€€', description: '15€ – 35€ par personne' },
   { value: 'UPSCALE', label: 'Haut de gamme', symbol: '€€€', description: '35€ – 70€ par personne' },
   { value: 'FINE_DINING', label: 'Gastronomique', symbol: '€€€€', description: 'Plus de 70€ par personne' },
 ]

 const featureOptions: { value: RestaurantFeature; label: string; icon: string }[] = [
   { value: 'VEGAN_FRIENDLY', label: 'Vegan friendly', icon: '🌱' },
   { value: 'VEGETARIAN_FRIENDLY', label: 'Végétarien', icon: '🥗' },
   { value: 'HALAL', label: 'Halal', icon: '☪️' },
   { value: 'KOSHER', label: 'Casher', icon: '✡️' },
   { value: 'GLUTEN_FREE', label: 'Sans gluten', icon: '🌾' },
   { value: 'WHEELCHAIR_ACCESSIBLE', label: 'Accès PMR', icon: '♿' },
   { value: 'PARKING', label: 'Parking', icon: '🅿️' },
   { value: 'TERRACE', label: 'Terrasse', icon: '☀️' },
   { value: 'WIFI', label: 'Wi-Fi', icon: '📶' },
   { value: 'PET_FRIENDLY', label: 'Animaux acceptés', icon: '🐾' },
 ]

 function toggleCuisine(value: CuisineType) {
   const idx = cuisineTypes.value.indexOf(value)
   if (idx === -1) cuisineTypes.value.push(value)
   else cuisineTypes.value.splice(idx, 1)
 }

 function toggleFeature(value: RestaurantFeature) {
   const idx = features.value.indexOf(value)
   if (idx === -1) features.value.push(value)
   else features.value.splice(idx, 1)
 }

 onMounted(async () => {
   try {
     await restaurantStore.fetchMyRestaurant()
     const r = restaurantStore.myRestaurant
     if (r) {
       name.value = r.name ?? ''
       description.value = r.description ?? ''
       phone.value = r.phone ?? ''
       email.value = r.email ?? ''
       street.value = r.address?.street ?? ''
       city.value = r.address?.city ?? ''
       postalCode.value = r.address?.postalCode ?? ''
      cuisineTypes.value = r.cuisineTypes ?? []
      priceRange.value = r.priceRange ?? null
      features.value = r.features ?? []
      openingHours.value = r.openingHours?.length ? r.openingHours : defaultOpeningHours()
     }
   } catch {
     errorMessage.value = 'Impossible de charger les informations du restaurant.'
   }
 })

 async function handleSubmit() {
   successMessage.value = null
   errorMessage.value = null

   const payload = {
     name: name.value,
     description: description.value,
     phone: phone.value,
     email: email.value,
     address: {
       street: street.value,
       city: city.value,
       postalCode: postalCode.value,
       country: 'France',
     },
    cuisineTypes: cuisineTypes.value,
    priceRange: priceRange.value ?? undefined,
    features: features.value,
    openingHours: openingHours.value,
  }

   try {
     if (restaurantStore.myRestaurant) {
       await restaurantStore.updateRestaurant(restaurantStore.myRestaurant.id, payload)
     } else {
       await restaurantStore.createRestaurant(payload)
     }
     successMessage.value = 'Les paramètres ont été enregistrés avec succès.'
   } catch {
     errorMessage.value = restaurantStore.error ?? 'Une erreur est survenue lors de la sauvegarde.'
   }
 }
</script>

<template>
  <div class="restaurant-settings">
    <h1>Paramètres du restaurant</h1>

    <form @submit.prevent="handleSubmit">
      <BaseCard>
        <template #header>
          <h2>Informations générales</h2>
        </template>

        <div class="form-grid">
          <BaseInput
            id="name"
            v-model="name"
            label="Nom du restaurant"
            placeholder="Le nom de votre établissement"
            required
          />

          <div class="form-group full-width">
            <label for="description" class="input-label">Description</label>
            <textarea
              id="description"
              v-model="description"
              class="textarea"
              rows="4"
              placeholder="Décrivez votre restaurant..."
            ></textarea>
          </div>

          <BaseInput
            id="phone"
            v-model="phone"
            type="tel"
            label="Téléphone"
            placeholder="01 23 45 67 89"
            required
          />

          <BaseInput
            id="email"
            v-model="email"
            type="email"
            label="Email"
            placeholder="contact@restaurant.com"
          />
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <h2>Adresse</h2>
        </template>

        <div class="form-grid">
          <div class="full-width">
            <BaseInput
              id="street"
              v-model="street"
              label="Rue"
              placeholder="123 rue de la Gastronomie"
              required
            />
          </div>

          <BaseInput id="city" v-model="city" label="Ville" placeholder="Paris" required />

          <BaseInput
            id="postalCode"
            v-model="postalCode"
            label="Code postal"
            placeholder="75001"
            required
          />
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <h2>Type de cuisine</h2>
        </template>

        <p class="section-hint">Sélectionnez un ou plusieurs types de cuisine proposés.</p>
        <div class="chip-grid">
          <button
            v-for="option in cuisineOptions"
            :key="option.value"
            type="button"
            class="chip"
            :class="{ 'chip--active': cuisineTypes.includes(option.value) }"
            @click="toggleCuisine(option.value)"
          >
            <span class="chip-icon">{{ option.icon }}</span>
            <span>{{ option.label }}</span>
          </button>
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <h2>Gamme de prix</h2>
        </template>

        <p class="section-hint">Choisissez la gamme de prix qui correspond à votre restaurant.</p>
        <div class="price-grid">
          <button
            v-for="option in priceOptions"
            :key="option.value"
            type="button"
            class="price-card"
            :class="{ 'price-card--active': priceRange === option.value }"
            @click="priceRange = option.value"
          >
            <span class="price-symbol">{{ option.symbol }}</span>
            <span class="price-label">{{ option.label }}</span>
            <span class="price-desc">{{ option.description }}</span>
          </button>
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <h2>Caractéristiques</h2>
        </template>

        <p class="section-hint">Indiquez les services et équipements disponibles dans votre restaurant.</p>
        <div class="chip-grid">
          <button
            v-for="option in featureOptions"
            :key="option.value"
            type="button"
            class="chip"
            :class="{ 'chip--active': features.includes(option.value) }"
            @click="toggleFeature(option.value)"
          >
            <span class="chip-icon">{{ option.icon }}</span>
            <span>{{ option.label }}</span>
          </button>
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <h2>Horaires d'ouverture</h2>
        </template>

        <p class="section-hint">Définissez vos horaires d'ouverture pour chaque jour de la semaine.</p>
        <div class="hours-grid">
          <div v-for="day in openingHours" :key="day.dayOfWeek" class="hours-row">
            <span class="hours-day">{{ DAY_NAMES[day.dayOfWeek] }}</span>
            <label class="hours-toggle">
              <input type="checkbox" :checked="!day.isClosed" @change="day.isClosed = !($event.target as HTMLInputElement).checked" />
              <span>{{ day.isClosed ? 'Fermé' : 'Ouvert' }}</span>
            </label>
            <template v-if="!day.isClosed">
              <div class="hours-time">
                <label class="hours-time-label">Ouverture</label>
                <input type="time" v-model="day.openTime" class="time-input" />
              </div>
              <div class="hours-time">
                <label class="hours-time-label">Fermeture</label>
                <input type="time" v-model="day.closeTime" class="time-input" />
              </div>
            </template>
            <div v-else class="hours-closed-placeholder" />
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <h2>Photos</h2>
        </template>

        <p class="placeholder">Le gestionnaire de photos sera implémenté ici.</p>
      </BaseCard>

      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

      <div class="form-actions">
        <BaseButton type="submit" variant="primary" :loading="restaurantStore.isLoading">
          Enregistrer les modifications
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .restaurant-settings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: var(--color-primary);
  }

  h2 {
    margin-bottom: 0;
    font-size: 1.25rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }

  .full-width {
    grid-column: 1 / -1;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .input-label {
    font-weight: 500;
    font-size: 0.875rem;
  }

  .textarea {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    font-family: inherit;
    font-size: 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    resize: vertical;
  }

  .textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.1);
  }

  .placeholder {
    color: var(--color-text-muted);
    margin-bottom: 0;
  }

  .section-hint {
    color: var(--color-text-muted);
    font-size: 0.875rem;
    margin-bottom: var(--spacing-md);
  }

  .chip-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: 1.5px solid var(--color-border);
    border-radius: 999px;
    background: transparent;
    cursor: pointer;
    font-size: 0.875rem;
    font-family: inherit;
    color: var(--color-text);
    transition:
      border-color 0.15s,
      background 0.15s,
      color 0.15s;
  }

  .chip:hover {
    border-color: var(--color-primary);
    background: rgba(44, 85, 48, 0.05);
  }

  .chip--active {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: #fff;
  }

  .chip-icon {
    font-size: 1rem;
    line-height: 1;
  }

  .price-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-sm);
  }

  .price-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: var(--spacing-md) var(--spacing-sm);
    border: 1.5px solid var(--color-border);
    border-radius: var(--border-radius);
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    text-align: center;
    transition:
      border-color 0.15s,
      background 0.15s;
  }

  .price-card:hover {
    border-color: var(--color-primary);
    background: rgba(44, 85, 48, 0.05);
  }

  .price-card--active {
    border-color: var(--color-primary);
    background: rgba(44, 85, 48, 0.08);
  }

  .price-symbol {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .price-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .price-desc {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  @media (max-width: 600px) {
    .price-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .hours-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .hours-row {
    display: grid;
    grid-template-columns: 100px 110px 1fr 1fr;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--color-border-light);
  }

  .hours-row:last-child {
    border-bottom: none;
  }

  .hours-day {
    font-weight: 500;
    font-size: 0.9rem;
  }

  .hours-toggle {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    cursor: pointer;
    font-size: 0.875rem;
    user-select: none;
  }

  .hours-toggle input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: var(--color-primary);
    cursor: pointer;
  }

  .hours-time {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .hours-time-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .time-input {
    padding: 6px 8px;
    font-family: inherit;
    font-size: 0.875rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    color: var(--color-text);
    background: var(--color-background);
    width: 120px;
  }

  .time-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.1);
  }

  .hours-closed-placeholder {
    grid-column: span 2;
  }

  @media (max-width: 600px) {
    .hours-row {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
    }

    .hours-day {
      grid-column: 1 / -1;
    }
  }

  .alert {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius);
    font-size: 0.875rem;
  }

  .alert-success {
    background-color: #e6f4ea;
    color: #2c5530;
    border: 1px solid #b7d9bb;
  }

  .alert-error {
    background-color: #fdecea;
    color: #b71c1c;
    border: 1px solid #f5c6cb;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 600px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
