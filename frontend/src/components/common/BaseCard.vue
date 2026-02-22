<script setup lang="ts">
  interface Props {
    padding?: 'none' | 'sm' | 'md' | 'lg'
    hoverable?: boolean
  }

  withDefaults(defineProps<Props>(), {
    padding: 'md',
    hoverable: false,
  })
</script>

<template>
  <div :class="['card', `padding-${padding}`, { hoverable }]">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
  .card {
    background-color: var(--color-background);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .hoverable {
    transition: box-shadow var(--transition), transform var(--transition);
  }

  .hoverable:hover {
    box-shadow: var(--shadow);
    transform: translateY(-2px);
  }

  .padding-none .card-body {
    padding: 0;
  }

  .padding-sm .card-body {
    padding: var(--spacing-sm);
  }

  .padding-md .card-body {
    padding: var(--spacing-md);
  }

  .padding-lg .card-body {
    padding: var(--spacing-xl);
  }

  .card-header {
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--color-border-light);
    background-color: var(--color-background-soft);
  }

  .card-footer {
    padding: var(--spacing-md) var(--spacing-lg);
    border-top: 1px solid var(--color-border-light);
    background-color: var(--color-background-soft);
  }
</style>
