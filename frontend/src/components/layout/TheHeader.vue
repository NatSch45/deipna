<script setup lang="ts">
  import { computed } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  const router = useRouter()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isRestaurantOwner = computed(() => authStore.isRestaurantOwner)
  const userName = computed(() => {
    if (authStore.user) {
      return `${authStore.user.firstName} ${authStore.user.lastName}`
    }
    return ''
  })

  async function handleLogout() {
    await authStore.logout()
    router.push('/')
  }
</script>

<template>
  <header class="header">
    <div class="header-content">
      <RouterLink to="/" class="logo">
        <span class="logo-text">Deipna</span>
      </RouterLink>

      <nav class="nav">
        <RouterLink to="/restaurants" class="nav-link">Restaurants</RouterLink>

        <template v-if="isAuthenticated">
          <RouterLink v-if="isRestaurantOwner" to="/dashboard" class="nav-link">
            Mon Restaurant
          </RouterLink>
          <RouterLink v-else to="/my-reservations" class="nav-link">Mes Réservations</RouterLink>

          <div class="user-menu">
            <span class="user-name">{{ userName }}</span>
            <button class="btn btn-outline" @click="handleLogout">Déconnexion</button>
          </div>
        </template>

        <template v-else>
          <RouterLink to="/login" class="btn btn-outline">Connexion</RouterLink>
          <RouterLink to="/register" class="btn btn-primary">Inscription</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
  .header {
    background-color: var(--color-background);
    border-bottom: 1px solid var(--color-border-light);
    padding: var(--spacing-md) 0;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    text-decoration: none;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .nav {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .nav-link {
    color: var(--color-text);
    font-weight: 500;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius);
    transition: background-color var(--transition-fast);
  }

  .nav-link:hover {
    background-color: var(--color-background-soft);
    color: var(--color-primary);
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .user-name {
    font-weight: 500;
    color: var(--color-text-light);
  }
</style>
