<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    currentPage: number  // 0-indexed
    totalPages: number
    totalElements: number
    pageSize: number
    pageSizeOptions?: number[]
  }

  const props = withDefaults(defineProps<Props>(), {
    pageSizeOptions: () => [9, 18, 27],
  })

  const emit = defineEmits<{
    'update:currentPage': [page: number]
    'update:pageSize': [size: number]
  }>()

  // Pages to display: always first, last, current ±2, with ellipsis gaps
  const pages = computed(() => {
    const total = props.totalPages
    if (total <= 7) return Array.from({ length: total }, (_, i) => i)

    const current = props.currentPage
    const result: (number | '...')[] = []

    const around = new Set([0, total - 1, current - 2, current - 1, current, current + 1, current + 2].filter(
      (p) => p >= 0 && p < total,
    ))

    let prev: number | null = null
    for (const p of [...around].sort((a, b) => a - b)) {
      if (prev !== null && p - prev > 1) result.push('...')
      result.push(p)
      prev = p
    }

    return result
  })

  const from = computed(() => props.currentPage * props.pageSize + 1)
  const to = computed(() =>
    Math.min((props.currentPage + 1) * props.pageSize, props.totalElements),
  )
</script>

<template>
  <div class="pagination">
    <div class="pagination-left">
      <span class="pagination-info">
        {{ from }}–{{ to }} sur {{ totalElements }} résultats
      </span>
      <label class="page-size-label">
        Afficher
        <select
          class="page-size-select"
          :value="pageSize"
          @change="emit('update:pageSize', Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        par page
      </label>
    </div>

    <div v-if="totalPages > 1" class="pagination-controls">
      <button
        class="page-btn nav-btn"
        :disabled="currentPage === 0"
        @click="emit('update:currentPage', currentPage - 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>

      <template v-for="(page, i) in pages" :key="i">
        <span v-if="page === '...'" class="page-ellipsis">…</span>
        <button
          v-else
          class="page-btn"
          :class="{ active: page === currentPage }"
          @click="emit('update:currentPage', page)"
        >
          {{ page + 1 }}
        </button>
      </template>

      <button
        class="page-btn nav-btn"
        :disabled="currentPage === totalPages - 1"
        @click="emit('update:currentPage', currentPage + 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
    </div>
  </div>

</template>

<style scoped>
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }

  .pagination-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
  }

  .pagination-info {
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  .page-size-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  .page-size-select {
    padding: 2px var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background-color: var(--color-background);
    color: var(--color-text);
    font-size: 0.875rem;
    cursor: pointer;
  }

  .page-size-select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(44, 85, 48, 0.15);
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
    padding: 0 var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background-color: var(--color-background);
    color: var(--color-text);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
  }

  .page-btn:hover:not(:disabled):not(.active) {
    background-color: var(--color-background-soft);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .page-btn.active {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: #fff;
    cursor: default;
  }

  .page-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .nav-btn {
    color: var(--color-text-light);
  }

  .page-ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
    color: var(--color-text-muted);
    font-size: 0.875rem;
    user-select: none;
  }
</style>
