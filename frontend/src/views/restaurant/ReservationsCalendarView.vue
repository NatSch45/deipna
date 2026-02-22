<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import BaseCard from '@/components/common/BaseCard.vue'
  import BaseButton from '@/components/common/BaseButton.vue'
  import { useRestaurantStore } from '@/stores/restaurant'
  import { reservationService } from '@/services/reservationService'
  import type { Reservation, ReservationStatus } from '@/types/reservation'

  const restaurantStore = useRestaurantStore()

  const currentDate = ref(new Date())
  const selectedDate = ref<string | null>(null)
  const monthReservations = ref<Reservation[]>([])
  const isLoading = ref(false)
  const selectedReservation = ref<Reservation | null>(null)
  const statusActionLoading = ref(false)
  const statusActionError = ref<string | null>(null)

  const STATUS_LABELS: Record<string, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    CANCELLED: 'Refusée',
    COMPLETED: 'Terminée',
    NO_SHOW: 'Absent',
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Normalise toute date (ISO ou date-only) en "YYYY-MM-DD". */
  function normalizeDate(raw: string): string {
    return raw.substring(0, 10)
  }

  function toDateString(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  function isToday(date: Date): boolean {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  function isSelected(date: Date): boolean {
    return toDateString(date) === selectedDate.value
  }

  function reservationsForDate(date: Date): Reservation[] {
    const key = toDateString(date)
    return monthReservations.value.filter((r) => normalizeDate(r.date) === key)
  }

  function formatSelectedDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  // ── Calendar data ──────────────────────────────────────────────────────────

  const currentMonth = computed(() =>
    currentDate.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  )

  const daysInMonth = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: { date: Date; isCurrentMonth: boolean }[] = []

    let startDayOfWeek = firstDay.getDay()
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false })
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }
    const endDayOfWeek = lastDay.getDay()
    const remaining = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }
    return days
  })

  const selectedDayReservations = computed(() => {
    if (!selectedDate.value) return []
    return monthReservations.value.filter(
      (r) => normalizeDate(r.date) === selectedDate.value
    )
  })

  const totalThisMonth = computed(() => monthReservations.value.length)

  // ── API calls ──────────────────────────────────────────────────────────────

  async function loadMonthReservations() {
    if (!restaurantStore.myRestaurant) return
    isLoading.value = true
    try {
      const year = currentDate.value.getFullYear()
      const month = currentDate.value.getMonth()
      const startDate = toDateString(new Date(year, month, 1))
      const endDate = toDateString(new Date(year, month + 1, 0))
      monthReservations.value = await reservationService.getRestaurantReservations(
        restaurantStore.myRestaurant.id,
        startDate,
        endDate
      )
    } catch {
      monthReservations.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function applyStatus(status: ReservationStatus) {
    if (!selectedReservation.value) return
    statusActionLoading.value = true
    statusActionError.value = null
    try {
      const updated = await reservationService.updateStatus(selectedReservation.value.id, status)
      // Update in the local list
      const idx = monthReservations.value.findIndex((r) => r.id === updated.id)
      if (idx !== -1) monthReservations.value[idx] = updated
      selectedReservation.value = updated
    } catch {
      statusActionError.value = 'Une erreur est survenue. Veuillez réessayer.'
    } finally {
      statusActionLoading.value = false
    }
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  function selectDay(date: Date) {
    selectedDate.value = toDateString(date)
    selectedReservation.value = null
    statusActionError.value = null
  }

  function selectReservation(res: Reservation) {
    selectedReservation.value = res
    statusActionError.value = null
  }

  function backToList() {
    selectedReservation.value = null
    statusActionError.value = null
  }

  function previousMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
    selectedDate.value = null
    selectedReservation.value = null
  }

  function nextMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
    selectedDate.value = null
    selectedReservation.value = null
  }

  onMounted(async () => {
    await restaurantStore.fetchMyRestaurant()
    await loadMonthReservations()
  })

  watch(currentDate, loadMonthReservations)
</script>

<template>
  <div class="reservations-calendar">
    <header class="calendar-header">
      <h1>Calendrier des réservations</h1>
    </header>

    <div class="calendar-layout">
      <!-- ── Calendrier ── -->
      <main class="calendar-main">
        <BaseCard>
          <div class="calendar-nav">
            <BaseButton variant="outline" size="sm" @click="previousMonth">&lt; Précédent</BaseButton>
            <h2>{{ currentMonth }}</h2>
            <BaseButton variant="outline" size="sm" @click="nextMonth">Suivant &gt;</BaseButton>
          </div>

          <div v-if="isLoading" class="calendar-loading">Chargement…</div>

          <div v-else class="calendar-grid">
            <div class="calendar-header-row">
              <div class="day-header">Lun</div>
              <div class="day-header">Mar</div>
              <div class="day-header">Mer</div>
              <div class="day-header">Jeu</div>
              <div class="day-header">Ven</div>
              <div class="day-header">Sam</div>
              <div class="day-header">Dim</div>
            </div>

            <div class="calendar-body">
              <div
                v-for="(day, index) in daysInMonth"
                :key="index"
                :class="[
                  'calendar-day',
                  {
                    'other-month': !day.isCurrentMonth,
                    today: isToday(day.date),
                    selected: isSelected(day.date),
                  },
                ]"
                @click="day.isCurrentMonth && selectDay(day.date)"
              >
                <span class="day-number">{{ day.date.getDate() }}</span>
                <div class="day-content">
                  <span
                    v-if="day.isCurrentMonth && reservationsForDate(day.date).length > 0"
                    class="reservation-badge"
                  >
                    {{ reservationsForDate(day.date).length }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </main>

      <!-- ── Sidebar ── -->
      <aside class="calendar-sidebar">

        <!-- Détail d'une réservation -->
        <BaseCard v-if="selectedReservation">
          <div class="detail-header">
            <button class="back-btn" @click="backToList">← Retour</button>
            <span
              class="res-status-badge"
              :class="`status-${selectedReservation.status.toLowerCase()}`"
            >
              {{ STATUS_LABELS[selectedReservation.status] ?? selectedReservation.status }}
            </span>
          </div>

          <div class="detail-body">
            <div class="detail-time">
              {{ normalizeDate(selectedReservation.date) }} à {{ selectedReservation.time }}
            </div>

            <section class="detail-section">
              <h4>Client</h4>
              <p>{{ selectedReservation.guestInfo?.firstName }} {{ selectedReservation.guestInfo?.lastName }}</p>
              <p v-if="selectedReservation.guestInfo?.email">
                <a :href="`mailto:${selectedReservation.guestInfo.email}`">
                  {{ selectedReservation.guestInfo.email }}
                </a>
              </p>
              <p v-if="selectedReservation.guestInfo?.phone">
                <a :href="`tel:${selectedReservation.guestInfo.phone}`">
                  {{ selectedReservation.guestInfo.phone }}
                </a>
              </p>
            </section>

            <section class="detail-section">
              <h4>Réservation</h4>
              <p>{{ selectedReservation.partySize }} couvert{{ selectedReservation.partySize > 1 ? 's' : '' }}</p>
              <p v-if="selectedReservation.notes" class="detail-notes">
                {{ selectedReservation.notes }}
              </p>
            </section>

            <div v-if="statusActionError" class="alert-error">{{ statusActionError }}</div>

            <!-- Actions selon le statut actuel -->
            <div v-if="selectedReservation.status === 'PENDING'" class="detail-actions">
              <BaseButton
                variant="primary"
                size="sm"
                :loading="statusActionLoading"
                @click="applyStatus('CONFIRMED')"
              >
                Confirmer
              </BaseButton>
              <BaseButton
                variant="danger"
                size="sm"
                :loading="statusActionLoading"
                @click="applyStatus('CANCELLED')"
              >
                Refuser
              </BaseButton>
            </div>

            <div v-else-if="selectedReservation.status === 'CONFIRMED'" class="detail-actions">
              <BaseButton
                variant="outline"
                size="sm"
                :loading="statusActionLoading"
                @click="applyStatus('COMPLETED')"
              >
                Marquer terminée
              </BaseButton>
              <BaseButton
                variant="danger"
                size="sm"
                :loading="statusActionLoading"
                @click="applyStatus('CANCELLED')"
              >
                Annuler
              </BaseButton>
            </div>

            <div
              v-else-if="selectedReservation.status === 'CANCELLED'"
              class="detail-status-final"
            >
              Cette réservation a été refusée / annulée.
            </div>

            <div
              v-else-if="selectedReservation.status === 'COMPLETED'"
              class="detail-status-final"
            >
              Réservation terminée.
            </div>
          </div>
        </BaseCard>

        <!-- Liste des réservations du jour sélectionné -->
        <BaseCard v-else>
          <h3>
            {{ selectedDate ? formatSelectedDate(selectedDate) : 'Sélectionnez une date' }}
          </h3>

          <div v-if="selectedDate">
            <div v-if="selectedDayReservations.length === 0" class="placeholder">
              Aucune réservation pour ce jour.
            </div>
            <ul v-else class="reservation-list">
              <li
                v-for="res in selectedDayReservations"
                :key="res.id"
                class="reservation-item"
                @click="selectReservation(res)"
              >
                <div class="res-time">{{ res.time }}</div>
                <div class="res-info">
                  <span class="res-name">
                    {{ res.guestInfo?.firstName }} {{ res.guestInfo?.lastName }}
                  </span>
                  <span class="res-details">
                    {{ res.partySize }} couvert{{ res.partySize > 1 ? 's' : '' }}
                  </span>
                  <span
                    class="res-status"
                    :class="`status-${res.status.toLowerCase()}`"
                  >
                    {{ STATUS_LABELS[res.status] ?? res.status }}
                  </span>
                </div>
                <span class="res-arrow">›</span>
              </li>
            </ul>
          </div>
          <p v-else class="placeholder">Sélectionnez une date pour voir les réservations.</p>
        </BaseCard>

        <!-- Statistiques -->
        <BaseCard>
          <h3>Statistiques du mois</h3>
          <div class="stats">
            <div class="stat-item">
              <span class="stat-value">{{ totalThisMonth }}</span>
              <span class="stat-label">Réservations ce mois</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">
                {{ monthReservations.filter((r) => r.status === 'CONFIRMED').length }}
              </span>
              <span class="stat-label">Confirmées</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">
                {{ monthReservations.filter((r) => r.status === 'PENDING').length }}
              </span>
              <span class="stat-label">En attente</span>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>
  </div>
</template>

<style scoped>
  .reservations-calendar {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .calendar-header h1 {
    color: var(--color-primary);
    margin-bottom: 0;
  }

  .calendar-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: var(--spacing-lg);
    align-items: start;
  }

  @media (max-width: 1000px) {
    .calendar-layout {
      grid-template-columns: 1fr;
    }
  }

  /* ── Calendrier ── */

  .calendar-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
  }

  .calendar-nav h2 {
    margin-bottom: 0;
    text-transform: capitalize;
  }

  .calendar-loading {
    text-align: center;
    color: var(--color-text-muted);
    padding: var(--spacing-xl);
  }

  .calendar-grid {
    display: flex;
    flex-direction: column;
  }

  .calendar-header-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background-color: var(--color-border-light);
    margin-bottom: 1px;
  }

  .day-header {
    padding: var(--spacing-sm);
    text-align: center;
    font-weight: 600;
    background-color: var(--color-background-soft);
    font-size: 0.8rem;
  }

  .calendar-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background-color: var(--color-border-light);
  }

  .calendar-day {
    min-height: 80px;
    padding: var(--spacing-sm);
    background-color: var(--color-background);
    cursor: pointer;
    transition: background-color 0.1s;
  }

  .calendar-day:hover:not(.other-month) {
    background-color: rgba(44, 85, 48, 0.04);
  }

  .calendar-day.other-month {
    background-color: var(--color-background-soft);
    cursor: default;
  }

  .calendar-day.other-month .day-number {
    color: var(--color-text-muted);
  }

  .calendar-day.today .day-number {
    background-color: var(--color-primary);
    color: white;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .calendar-day.selected {
    background-color: rgba(44, 85, 48, 0.1);
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }

  .day-number {
    font-weight: 500;
    font-size: 0.875rem;
    margin-bottom: var(--spacing-xs);
  }

  .day-content {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
  }

  .reservation-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-primary);
    color: white;
    border-radius: 10px;
    font-size: 0.65rem;
    font-weight: 600;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
  }

  /* ── Sidebar ── */

  .calendar-sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  h3 {
    font-size: 1rem;
    margin-bottom: var(--spacing-md);
    color: var(--color-primary);
    text-transform: capitalize;
  }

  .placeholder {
    color: var(--color-text-muted);
    font-size: 0.875rem;
    margin-bottom: 0;
  }

  /* ── Liste des réservations ── */

  .reservation-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .reservation-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius);
    background-color: var(--color-background-soft);
    cursor: pointer;
    transition: border-color 0.1s, background-color 0.1s;
  }

  .reservation-item:hover {
    border-color: var(--color-primary);
    background-color: rgba(44, 85, 48, 0.04);
  }

  .res-time {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-primary);
    white-space: nowrap;
    min-width: 40px;
  }

  .res-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    overflow: hidden;
  }

  .res-name {
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .res-details {
    font-size: 0.75rem;
    color: var(--color-text-light);
  }

  .res-status {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 8px;
    width: fit-content;
  }

  .res-arrow {
    color: var(--color-text-muted);
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  /* ── Détail réservation ── */

  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-md);
  }

  .back-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--color-primary);
    padding: 0;
    font-family: inherit;
    font-weight: 500;
  }

  .back-btn:hover {
    text-decoration: underline;
  }

  .res-status-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 999px;
  }

  .detail-body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .detail-time {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  .detail-section h4 {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
    margin-bottom: var(--spacing-xs);
  }

  .detail-section p {
    font-size: 0.875rem;
    margin-bottom: 2px;
    color: var(--color-text);
  }

  .detail-section a {
    color: var(--color-primary);
    text-decoration: none;
  }

  .detail-section a:hover {
    text-decoration: underline;
  }

  .detail-notes {
    color: var(--color-text-muted) !important;
    font-style: italic;
  }

  .detail-actions {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }

  .detail-status-final {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    font-style: italic;
  }

  .alert-error {
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    font-size: 0.8rem;
    background-color: #fdecea;
    color: #b71c1c;
    border: 1px solid #f5c6cb;
  }

  /* ── Badges de statut ── */

  .status-pending {
    background-color: #fff3cd;
    color: #856404;
  }

  .status-confirmed {
    background-color: #d1e7dd;
    color: #0f5132;
  }

  .status-cancelled {
    background-color: #f8d7da;
    color: #842029;
  }

  .status-completed {
    background-color: #e2e3e5;
    color: #41464b;
  }

  .status-no_show {
    background-color: #fdecea;
    color: #b71c1c;
  }

  /* ── Statistiques ── */

  .stats {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--color-text-light);
  }
</style>
