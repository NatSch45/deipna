<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useReservationStore } from '@/stores/reservation'
  import BaseCard from '@/components/common/BaseCard.vue'
  import BaseButton from '@/components/common/BaseButton.vue'

  const reservationStore = useReservationStore()

  onMounted(async () => {
    await reservationStore.fetchMyReservations()
  })

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  async function handleCancel(id: string) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      await reservationStore.cancelReservation(id)
    }
  }
</script>

<template>
  <div class="my-reservations">
    <h1>Mes Réservations</h1>

    <div v-if="reservationStore.isLoading" class="loading">Chargement...</div>

    <template v-else>
      <section v-if="reservationStore.upcomingReservations.length > 0">
        <h2>À venir</h2>
        <div class="reservations-list">
          <BaseCard
            v-for="reservation in reservationStore.upcomingReservations"
            :key="reservation.id"
          >
            <div class="reservation-card">
              <div class="reservation-info">
                <h3>{{ reservation.restaurantName }}</h3>
                <p class="date">{{ formatDate(reservation.date) }} à {{ reservation.time }}</p>
                <p class="details">
                  Table {{ reservation.tableName }} - {{ reservation.partySize }} personne(s)
                </p>
                <span :class="['status', `status-${reservation.status.toLowerCase()}`]">
                  {{ reservation.status }}
                </span>
              </div>
              <div class="reservation-actions">
                <BaseButton
                  v-if="reservation.status !== 'CANCELLED'"
                  variant="danger"
                  size="sm"
                  @click="handleCancel(reservation.id)"
                >
                  Annuler
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        </div>
      </section>

      <section v-if="reservationStore.pastReservations.length > 0">
        <h2>Historique</h2>
        <div class="reservations-list">
          <BaseCard
            v-for="reservation in reservationStore.pastReservations"
            :key="reservation.id"
          >
            <div class="reservation-card">
              <div class="reservation-info">
                <h3>{{ reservation.restaurantName }}</h3>
                <p class="date">{{ formatDate(reservation.date) }} à {{ reservation.time }}</p>
                <p class="details">
                  Table {{ reservation.tableName }} - {{ reservation.partySize }} personne(s)
                </p>
                <span :class="['status', `status-${reservation.status.toLowerCase()}`]">
                  {{ reservation.status }}
                </span>
              </div>
            </div>
          </BaseCard>
        </div>
      </section>

      <div
        v-if="reservationStore.upcomingReservations.length === 0 && reservationStore.pastReservations.length === 0"
        class="no-reservations"
      >
        <p>Vous n'avez pas encore de réservations.</p>
        <RouterLink to="/restaurants">
          <BaseButton variant="primary">Rechercher un restaurant</BaseButton>
        </RouterLink>
      </div>
    </template>
  </div>
</template>

<style scoped>
  .my-reservations {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  h1 {
    color: var(--color-primary);
  }

  h2 {
    margin-bottom: var(--spacing-md);
  }

  .loading,
  .no-reservations {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--color-text-light);
  }

  .reservations-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .reservation-card {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .reservation-info h3 {
    margin-bottom: var(--spacing-xs);
  }

  .date {
    font-weight: 500;
    color: var(--color-primary);
    margin-bottom: var(--spacing-xs);
  }

  .details {
    color: var(--color-text-light);
    margin-bottom: var(--spacing-sm);
  }

  .status {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-pending {
    background-color: rgba(255, 193, 7, 0.2);
    color: #856404;
  }

  .status-confirmed {
    background-color: rgba(40, 167, 69, 0.2);
    color: #155724;
  }

  .status-cancelled {
    background-color: rgba(220, 53, 69, 0.2);
    color: #721c24;
  }

  .status-completed {
    background-color: rgba(23, 162, 184, 0.2);
    color: #0c5460;
  }
</style>
