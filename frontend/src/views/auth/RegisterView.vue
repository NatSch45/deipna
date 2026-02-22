<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter, RouterLink } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import type { UserRole } from '@/types/auth'
  import BaseButton from '@/components/common/BaseButton.vue'
  import BaseInput from '@/components/common/BaseInput.vue'
  import BaseCard from '@/components/common/BaseCard.vue'

  const router = useRouter()
  const authStore = useAuthStore()

  const firstName = ref('')
  const lastName = ref('')
  const email = ref('')
  const phone = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const role = ref<UserRole>('CUSTOMER')
  const error = ref('')

  async function handleSubmit() {
    error.value = ''

    if (password.value !== confirmPassword.value) {
      error.value = 'Les mots de passe ne correspondent pas'
      return
    }

    try {
      await authStore.register({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phone: phone.value || undefined,
        password: password.value,
        role: role.value,
      })
      router.push('/')
    } catch {
      error.value = "Une erreur s'est produite lors de l'inscription"
    }
  }
</script>

<template>
  <div class="register-page">
    <BaseCard padding="lg">
      <template #header>
        <h1>Créer un compte</h1>
      </template>

      <form novalidate @submit.prevent="handleSubmit">
        <div v-if="error" class="error-alert">
          {{ error }}
        </div>

        <div class="role-selector">
          <label class="role-option">
            <input v-model="role" type="radio" value="CUSTOMER" />
            <span>Je suis un client</span>
          </label>
          <label class="role-option">
            <input v-model="role" type="radio" value="RESTAURANT_OWNER" />
            <span>Je suis restaurateur</span>
          </label>
        </div>

        <div class="form-row">
          <BaseInput
            id="firstName"
            v-model="firstName"
            label="Prénom"
            placeholder="Votre prénom"
            required
          />
          <BaseInput
            id="lastName"
            v-model="lastName"
            label="Nom"
            placeholder="Votre nom"
            required
          />
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
          id="phone"
          v-model="phone"
          type="tel"
          label="Téléphone (optionnel)"
          placeholder="06 12 34 56 78"
        />

        <BaseInput
          id="password"
          v-model="password"
          type="password"
          label="Mot de passe"
          placeholder="Minimum 8 caractères"
          required
        />

        <BaseInput
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          label="Confirmer le mot de passe"
          placeholder="Confirmez votre mot de passe"
          required
        />

        <BaseButton type="submit" variant="primary" :loading="authStore.isLoading" class="submit-btn">
          Créer mon compte
        </BaseButton>
      </form>

      <template #footer>
        <p class="login-link">
          Déjà un compte ?
          <RouterLink to="/login">Se connecter</RouterLink>
        </p>
      </template>
    </BaseCard>
  </div>
</template>

<style scoped>
  .register-page {
    max-width: 500px;
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

  .role-selector {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
  }

  .role-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    transition: all var(--transition-fast);
  }

  .role-option:has(input:checked) {
    border-color: var(--color-primary);
    background-color: rgba(44, 85, 48, 0.05);
  }

  .role-option input {
    accent-color: var(--color-primary);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }

  .submit-btn {
    width: 100%;
    margin-top: var(--spacing-md);
  }

  .login-link {
    text-align: center;
    margin-bottom: 0;
  }
</style>
