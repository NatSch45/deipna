<script setup lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
  }

  withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    type: 'button',
  })

  defineEmits<{
    click: [event: MouseEvent]
  }>()
</script>

<template>
  <button
    :type="type"
    :class="['base-button', `variant-${variant}`, `size-${size}`]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="loader"></span>
    <slot v-else />
  </button>
</template>

<style scoped>
  .base-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    font-weight: 500;
    border: 2px solid transparent;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .base-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Sizes */
  .size-sm {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: 0.875rem;
  }

  .size-md {
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: 1rem;
  }

  .size-lg {
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: 1.125rem;
  }

  /* Variants */
  .variant-primary {
    background-color: var(--color-primary);
    color: white;
  }

  .variant-primary:hover:not(:disabled) {
    background-color: var(--color-primary-light);
  }

  .variant-secondary {
    background-color: var(--color-secondary);
    color: var(--color-text);
  }

  .variant-secondary:hover:not(:disabled) {
    background-color: var(--color-secondary-light);
  }

  .variant-outline {
    background-color: transparent;
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .variant-outline:hover:not(:disabled) {
    background-color: var(--color-primary);
    color: white;
  }

  .variant-danger {
    background-color: var(--color-danger);
    color: white;
  }

  .variant-danger:hover:not(:disabled) {
    background-color: #c82333;
  }

  /* Loader */
  .loader {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
