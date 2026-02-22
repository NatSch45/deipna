<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import BaseCard from '@/components/common/BaseCard.vue'
</script>

<template>
  <div class="dashboard">
    <h1>Tableau de bord</h1>

    <div class="stats-grid">
      <BaseCard>
        <div class="stat">
          <span class="stat-value">--</span>
          <span class="stat-label">Réservations aujourd'hui</span>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="stat">
          <span class="stat-value">--</span>
          <span class="stat-label">Cette semaine</span>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="stat">
          <span class="stat-value">--</span>
          <span class="stat-label">Taux d'occupation</span>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="stat">
          <span class="stat-value">--</span>
          <span class="stat-label">Note moyenne</span>
        </div>
      </BaseCard>
    </div>

    <div class="quick-actions">
      <h2>Actions rapides</h2>
      <div class="actions-grid">
        <RouterLink to="/dashboard/reservations" class="action-link">
          <BaseCard hoverable>
            <div class="action-card">
              <h3>Calendrier des réservations</h3>
              <p>Consultez et gérez toutes vos réservations</p>
            </div>
          </BaseCard>
        </RouterLink>

        <RouterLink to="/dashboard/floor-plan" class="action-link">
          <BaseCard hoverable>
            <div class="action-card">
              <h3>Plan de salle</h3>
              <p>Éditez l'agencement de votre restaurant</p>
            </div>
          </BaseCard>
        </RouterLink>

        <RouterLink to="/dashboard/settings" class="action-link">
          <BaseCard hoverable>
            <div class="action-card">
              <h3>Paramètres</h3>
              <p>Modifiez les informations de votre restaurant</p>
            </div>
          </BaseCard>
        </RouterLink>
      </div>
    </div>

    <div class="insights">
      <h2>Analyses et suggestions</h2>
      <BaseCard>
        <p class="placeholder">
          Les analyses de vos habitudes de réservation et les suggestions d'optimisation seront
          affichées ici une fois que vous aurez suffisamment de données.
        </p>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
  .dashboard {
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

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .stat-label {
    color: var(--color-text-light);
    font-size: 0.875rem;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
  }

  .action-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
  }

  .action-link :deep(.card) {
    flex: 1;
  }

  .action-card h3 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }

  .action-card p {
    color: var(--color-text-light);
    margin-bottom: 0;
  }

  .placeholder {
    color: var(--color-text-muted);
    text-align: center;
    padding: var(--spacing-xl);
    margin-bottom: 0;
  }
</style>
