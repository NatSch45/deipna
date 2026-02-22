<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRestaurantStore } from '@/stores/restaurant'
  import { useReservationStore } from '@/stores/reservation'
  import { useAuthStore } from '@/stores/auth'
  import BaseCard from '@/components/common/BaseCard.vue'
  import BaseButton from '@/components/common/BaseButton.vue'

  const route = useRoute()
  const restaurantStore = useRestaurantStore()
  const reservationStore = useReservationStore()
  const authStore = useAuthStore()

  const restaurantId = route.params.id as string

  onMounted(async () => {
    await restaurantStore.fetchRestaurant(restaurantId)
  })

  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

  const today = new Date().toISOString().split('T')[0]

  // Booking widget state
  const selectedDate = ref('')
  const selectedTime = ref('')
  const partySize = ref(2)
  const firstName = ref(authStore.user?.firstName ?? '')
  const lastName = ref(authStore.user?.lastName ?? '')
  const email = ref(authStore.user?.email ?? '')
  const phone = ref('')
  const notes = ref('')
  const bookingSuccess = ref(false)
  const bookingError = ref<string | null>(null)

  async function onDateChange() {
    selectedTime.value = ''
    bookingSuccess.value = false
    bookingError.value = null
    if (selectedDate.value) {
      await reservationStore.fetchAvailableSlots(restaurantId, selectedDate.value)
    }
  }

  async function submitReservation() {
    bookingError.value = null
    bookingSuccess.value = false

    try {
      await reservationStore.createReservation({
        restaurantId,
        date: selectedDate.value,
        time: selectedTime.value,
        partySize: partySize.value,
        notes: notes.value || undefined,
        guestInfo: {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          phone: phone.value,
        },
      })
      bookingSuccess.value = true
      selectedDate.value = ''
      selectedTime.value = ''
      notes.value = ''
    } catch {
      bookingError.value = reservationStore.error ?? 'Une erreur est survenue. Veuillez réessayer.'
    }
  }
</script>

<template>
  <div class="restaurant-detail">
    <div v-if="restaurantStore.isLoading" class="loading">Chargement...</div>

    <template v-else-if="restaurantStore.currentRestaurant">
      <header class="restaurant-header">
        <h1>{{ restaurantStore.currentRestaurant.name }}</h1>
        <p class="address">
          {{ restaurantStore.currentRestaurant.address.street }},
          {{ restaurantStore.currentRestaurant.address.postalCode }}
          {{ restaurantStore.currentRestaurant.address.city }}
        </p>
      </header>

      <div class="content-grid">
        <div class="main-content">
          <BaseCard>
            <template #header>
              <h2>Description</h2>
            </template>
            <p>{{ restaurantStore.currentRestaurant.description }}</p>
          </BaseCard>

          <BaseCard>
            <template #header>
              <h2>Horaires d'ouverture</h2>
            </template>
            <ul class="opening-hours">
              <li
                v-for="hours in restaurantStore.currentRestaurant.openingHours"
                :key="hours.dayOfWeek"
              >
                <span class="day">{{ dayNames[hours.dayOfWeek] }}</span>
                <span v-if="hours.isClosed" class="closed">Fermé</span>
                <span v-else>{{ hours.openTime }} – {{ hours.closeTime }}</span>
              </li>
            </ul>
            <p v-if="!restaurantStore.currentRestaurant.openingHours?.length" class="no-hours">
              Horaires non renseignés.
            </p>
          </BaseCard>

          <BaseCard>
            <template #header>
              <h2>Contact</h2>
            </template>
            <p>
              <strong>Téléphone :</strong> {{ restaurantStore.currentRestaurant.phone }}
            </p>
            <p v-if="restaurantStore.currentRestaurant.email">
              <strong>Email :</strong> {{ restaurantStore.currentRestaurant.email }}
            </p>
          </BaseCard>
        </div>

        <aside class="sidebar">
          <BaseCard>
            <template #header>
              <h2>Réserver une table</h2>
            </template>

            <div v-if="bookingSuccess" class="alert alert-success">
              Votre réservation a été prise en compte ! Vous recevrez une confirmation prochainement.
            </div>

            <div v-else class="booking-widget">
              <!-- Step 1: date -->
              <div class="form-group">
                <label class="field-label" for="booking-date">Date</label>
                <input
                  id="booking-date"
                  v-model="selectedDate"
                  type="date"
                  :min="today"
                  class="field-input"
                  @change="onDateChange"
                />
              </div>

              <!-- Step 2: time slots -->
              <template v-if="selectedDate">
                <div v-if="reservationStore.isLoading" class="slots-loading">
                  Chargement des créneaux…
                </div>
                <div v-else-if="reservationStore.availableSlots.length === 0" class="no-slots">
                  Aucun créneau disponible pour ce jour.
                </div>
                <div v-else class="form-group">
                  <label class="field-label">Créneau horaire</label>
                  <div class="slots-grid">
                    <button
                      v-for="slot in reservationStore.availableSlots"
                      :key="slot"
                      type="button"
                      class="slot-btn"
                      :class="{ 'slot-btn--active': selectedTime === slot }"
                      @click="selectedTime = slot"
                    >
                      {{ slot }}
                    </button>
                  </div>
                </div>
              </template>

              <!-- Step 3: booking form -->
              <template v-if="selectedTime">
                <hr class="divider" />
                <p class="form-intro">
                  Réservation pour le <strong>{{ selectedDate }}</strong> à
                  <strong>{{ selectedTime }}</strong>
                </p>

                <div class="form-group">
                  <label class="field-label" for="party-size">Nombre de couverts</label>
                  <input
                    id="party-size"
                    v-model.number="partySize"
                    type="number"
                    min="1"
                    max="20"
                    class="field-input"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="field-label" for="first-name">Prénom</label>
                    <input id="first-name" v-model="firstName" type="text" class="field-input" required />
                  </div>
                  <div class="form-group">
                    <label class="field-label" for="last-name">Nom</label>
                    <input id="last-name" v-model="lastName" type="text" class="field-input" required />
                  </div>
                </div>

                <div class="form-group">
                  <label class="field-label" for="booking-email">Email</label>
                  <input id="booking-email" v-model="email" type="email" class="field-input" required />
                </div>

                <div class="form-group">
                  <label class="field-label" for="booking-phone">Téléphone</label>
                  <input id="booking-phone" v-model="phone" type="tel" class="field-input" required />
                </div>

                <div class="form-group">
                  <label class="field-label" for="booking-notes">Notes (optionnel)</label>
                  <textarea
                    id="booking-notes"
                    v-model="notes"
                    rows="2"
                    class="field-textarea"
                    placeholder="Allergies, occasion spéciale…"
                  ></textarea>
                </div>

                <div v-if="bookingError" class="alert alert-error">{{ bookingError }}</div>

                <BaseButton
                  variant="primary"
                  class="reserve-btn"
                  :loading="reservationStore.isLoading"
                  :disabled="!firstName || !lastName || !email || !phone"
                  @click="submitReservation"
                >
                  Confirmer la réservation
                </BaseButton>
              </template>
            </div>
          </BaseCard>

          <BaseCard v-if="restaurantStore.currentRestaurant.features.length > 0">
            <template #header>
              <h3>Caractéristiques</h3>
            </template>
            <ul class="features-list">
              <li
                v-for="feature in restaurantStore.currentRestaurant.features"
                :key="feature"
                class="feature-tag"
              >
                {{ feature.replace(/_/g, ' ').toLowerCase() }}
              </li>
            </ul>
          </BaseCard>
        </aside>
      </div>
    </template>

    <div v-else class="error">Restaurant non trouvé.</div>
  </div>
</template>

<style scoped>
  .restaurant-detail {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .loading,
  .error {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--color-text-light);
  }

  .restaurant-header {
    text-align: center;
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border-light);
  }

  .restaurant-header h1 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }

  .address {
    color: var(--color-text-light);
    margin-bottom: 0;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: var(--spacing-xl);
  }

  @media (max-width: 900px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
  }

  .main-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  h2 {
    margin-bottom: 0;
    font-size: 1.25rem;
  }

  h3 {
    margin-bottom: 0;
    font-size: 1rem;
  }

  .opening-hours {
    list-style: none;
  }

  .opening-hours li {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--color-border-light);
  }

  .opening-hours li:last-child {
    border-bottom: none;
  }

  .day {
    font-weight: 500;
  }

  .closed {
    color: var(--color-text-muted);
  }

  .no-hours {
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }

  .features-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .feature-tag {
    background-color: var(--color-background-soft);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    font-size: 0.875rem;
    text-transform: capitalize;
  }

  /* Booking widget */
  .booking-widget {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
  }

  .field-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .field-input {
    padding: 8px 10px;
    font-family: inherit;
    font-size: 0.875rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background: var(--color-background);
    color: var(--color-text);
    width: 100%;
  }

  .field-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.1);
  }

  .field-textarea {
    padding: 8px 10px;
    font-family: inherit;
    font-size: 0.875rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background: var(--color-background);
    color: var(--color-text);
    width: 100%;
    resize: vertical;
  }

  .field-textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.1);
  }

  .slots-loading,
  .no-slots {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    text-align: center;
    padding: var(--spacing-sm) 0;
  }

  .slots-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .slot-btn {
    padding: 6px 14px;
    font-family: inherit;
    font-size: 0.875rem;
    border: 1.5px solid var(--color-border);
    border-radius: var(--border-radius);
    background: transparent;
    cursor: pointer;
    color: var(--color-text);
    transition:
      border-color 0.15s,
      background 0.15s,
      color 0.15s;
  }

  .slot-btn:hover {
    border-color: var(--color-primary);
    background: rgba(44, 85, 48, 0.05);
  }

  .slot-btn--active {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: #fff;
  }

  .divider {
    border: none;
    border-top: 1px solid var(--color-border-light);
    margin: var(--spacing-xs) 0;
  }

  .form-intro {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-bottom: 0;
  }

  .reserve-btn {
    width: 100%;
    margin-top: var(--spacing-xs);
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
</style>
