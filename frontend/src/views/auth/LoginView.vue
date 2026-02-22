<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter, useRoute, RouterLink } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import BaseButton from '@/components/common/BaseButton.vue'
  import BaseInput from '@/components/common/BaseInput.vue'
  import BaseCard from '@/components/common/BaseCard.vue'

  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const error = ref('')

  async function handleSubmit() {
    error.value = ''

    try {
      await authStore.login({ email: email.value, password: password.value })
      const redirect = (route.query.redirect as string) || '/'
      router.push(redirect)
    } catch {
      error.value = 'Email ou mot de passe incorrect'
    }
  }
</script>

<template>
  <div class="login-page">
    <BaseCard padding="lg">
      <template #header>
        <h1>Connexion</h1>
      </template>

      <form novalidate @submit.prevent="handleSubmit">
        <div v-if="error" class="error-alert">
          {{ error }}
        </div>

        <BaseInput
          id="email"
          v-model="email"
          type="email"
          label="Email"
          placeholder="votre@email.com"
          required
        />

        <BaseInput
          id="password"
          v-model="password"
          type="password"
          label="Mot de passe"
          placeholder="Votre mot de passe"
          required
        />

        <BaseButton type="submit" variant="primary" :loading="authStore.isLoading" class="submit-btn">
          Se connecter
        </BaseButton>
      </form>

      <template #footer>
        <p class="register-link">
          Pas encore de compte ?
          <RouterLink to="/register">Créer un compte</RouterLink>
        </p>
      </template>
    </BaseCard>
  </div>
</template>

<style scoped>
  .login-page {
    max-width: 400px;
    margin: var(--spacing-xl) auto;
  }

  h1 {
    margin-bottom: 0;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .error-alert {
    padding: var(--spacing-md);
    background-color: rgba(220, 53, 69, 0.1);
    border: 1px solid var(--color-danger);
    border-radius: var(--border-radius);
    color: var(--color-danger);
    text-align: center;
  }

  .submit-btn {
    width: 100%;
    margin-top: var(--spacing-md);
  }

  .register-link {
    text-align: center;
    margin-bottom: 0;
  }
</style>
