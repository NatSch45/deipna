<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import BaseButton from '@/components/common/BaseButton.vue'
  import BaseCard from '@/components/common/BaseCard.vue'
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>Bienvenue sur Deipna</h1>
      <p class="hero-subtitle">
        Trouvez et réservez facilement une table dans les meilleurs restaurants près de chez vous.
      </p>
      <div class="hero-actions">
        <RouterLink to="/restaurants">
          <BaseButton variant="primary" size="lg">Rechercher un restaurant</BaseButton>
        </RouterLink>
        <RouterLink to="/register">
          <BaseButton variant="outline" size="lg">Créer un compte</BaseButton>
        </RouterLink>
      </div>
    </section>

    <section class="features">
      <h2>Comment ça marche ?</h2>
      <div class="features-grid">
        <BaseCard>
          <template #header>
            <h3>1. Recherchez</h3>
          </template>
          <p>
            Parcourez notre sélection de restaurants par type de cuisine, localisation ou
            caractéristiques spéciales.
          </p>
        </BaseCard>

        <BaseCard>
          <template #header>
            <h3>2. Réservez</h3>
          </template>
          <p>
            Choisissez votre date, heure et table préférée. Réservez en quelques clics, avec ou sans
            compte.
          </p>
        </BaseCard>

        <BaseCard>
          <template #header>
            <h3>3. Profitez</h3>
          </template>
          <p>
            Recevez une confirmation instantanée et profitez de votre repas sans stress de
            disponibilité.
          </p>
        </BaseCard>
      </div>
    </section>

    <section class="for-restaurants">
      <h2>Vous êtes restaurateur ?</h2>
      <p>
        Deipna vous aide à optimiser vos réservations, gérer vos salles et fidéliser vos clients
        grâce à des outils intelligents d'analyse et de planification.
      </p>
      <RouterLink to="/register">
        <BaseButton variant="secondary">Devenir partenaire</BaseButton>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
  .home {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
  }

  .hero {
    text-align: center;
    padding: var(--spacing-2xl) 0;
  }

  .hero h1 {
    font-size: 3rem;
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--color-text-light);
    max-width: 600px;
    margin: 0 auto var(--spacing-xl);
  }

  .hero-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;
  }

  .features {
    text-align: center;
  }

  .features h2 {
    margin-bottom: var(--spacing-xl);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }

  .features-grid h3 {
    margin-bottom: 0;
    color: var(--color-primary);
  }

  .for-restaurants {
    text-align: center;
    background-color: var(--color-background-soft);
    padding: var(--spacing-2xl);
    border-radius: var(--border-radius-lg);
  }

  .for-restaurants h2 {
    color: var(--color-primary);
  }

  .for-restaurants p {
    max-width: 600px;
    margin: 0 auto var(--spacing-lg);
    color: var(--color-text-light);
  }
</style>
