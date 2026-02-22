<script setup lang="ts">
  import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

  interface Option {
    value: string
    label: string
  }

  interface Props {
    modelValue: string
    options: Option[]
    placeholder?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Rechercher...',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const inputRef = ref<HTMLInputElement | null>(null)
  const wrapperRef = ref<HTMLElement | null>(null)
  const isOpen = ref(false)
  const query = ref('')
  const activeIndex = ref(-1)

  const selectedOption = computed(() =>
    props.options.find((o) => o.value === props.modelValue) ?? null,
  )

  const filteredOptions = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return props.options
    return props.options.filter((o) => o.label.toLowerCase().includes(q))
  })

  watch(
    () => props.modelValue,
    () => {
      query.value = ''
    },
  )

  function openDropdown() {
    isOpen.value = true
    query.value = ''
    activeIndex.value = -1
  }

  function closeDropdown() {
    isOpen.value = false
    query.value = ''
    activeIndex.value = -1
  }

  function selectOption(option: Option) {
    emit('update:modelValue', option.value)
    closeDropdown()
    inputRef.value?.blur()
  }

  function clearSelection(event: MouseEvent) {
    event.stopPropagation()
    emit('update:modelValue', '')
    closeDropdown()
  }

  function onKeydown(event: KeyboardEvent) {
    if (!isOpen.value) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') openDropdown()
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      activeIndex.value = Math.min(activeIndex.value + 1, filteredOptions.value.length - 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      activeIndex.value = Math.max(activeIndex.value - 1, 0)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (activeIndex.value >= 0 && filteredOptions.value[activeIndex.value]) {
        selectOption(filteredOptions.value[activeIndex.value])
      }
    } else if (event.key === 'Escape') {
      closeDropdown()
    }
  }

  function onClickOutside(event: MouseEvent) {
    if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
      closeDropdown()
    }
  }

  onMounted(() => document.addEventListener('mousedown', onClickOutside))
  onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div ref="wrapperRef" class="combobox">
    <div class="combobox-control" :class="{ open: isOpen }" @click="inputRef?.focus()">
      <input
        ref="inputRef"
        v-model="query"
        class="combobox-input"
        :placeholder="selectedOption ? selectedOption.label : placeholder"
        :class="{ 'has-value': !!selectedOption }"
        autocomplete="off"
        @focus="openDropdown"
        @keydown="onKeydown"
      />
      <button v-if="modelValue" class="combobox-clear" type="button" tabindex="-1" @mousedown="clearSelection">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
      <span class="combobox-chevron" :class="{ rotated: isOpen }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </span>
    </div>

    <ul v-if="isOpen" class="combobox-dropdown">
      <li v-if="filteredOptions.length === 0" class="combobox-empty">Aucun résultat</li>
      <li
        v-for="(option, index) in filteredOptions"
        :key="option.value"
        class="combobox-option"
        :class="{ active: index === activeIndex, selected: option.value === modelValue }"
        @mousedown.prevent="selectOption(option)"
      >
        {{ option.label }}
        <svg v-if="option.value === modelValue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" class="check-icon">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .combobox {
    position: relative;
    height: 42px;
  }

  .combobox-control {
    display: flex;
    align-items: center;
    height: 42px;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background-color: var(--color-background);
    cursor: text;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    padding: 0 var(--spacing-sm) 0 var(--spacing-md);
    gap: var(--spacing-xs);
  }

  .combobox-control.open {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.15);
  }

  .combobox-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
    color: var(--color-text);
    min-width: 0;
    cursor: text;
  }

  .combobox-input::placeholder {
    color: var(--color-text-light);
  }

  .combobox-input.has-value::placeholder {
    color: var(--color-text);
    font-weight: 500;
  }

  .combobox-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 2px;
    cursor: pointer;
    color: var(--color-text-muted);
    border-radius: 50%;
    flex-shrink: 0;
  }

  .combobox-clear:hover {
    color: var(--color-danger);
    background-color: var(--color-background-mute);
  }

  .combobox-chevron {
    display: flex;
    align-items: center;
    color: var(--color-text-muted);
    transition: transform var(--transition-fast);
    flex-shrink: 0;
  }

  .combobox-chevron.rotated {
    transform: rotate(180deg);
  }

  .combobox-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    z-index: 100;
    max-height: 240px;
    overflow-y: auto;
    list-style: none;
    padding: var(--spacing-xs) 0;
  }

  .combobox-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 0.925rem;
    cursor: pointer;
    color: var(--color-text);
    transition: background-color var(--transition-fast);
  }

  .combobox-option:hover,
  .combobox-option.active {
    background-color: var(--color-background-soft);
  }

  .combobox-option.selected {
    color: var(--color-primary);
    font-weight: 500;
  }

  .check-icon {
    color: var(--color-primary);
    flex-shrink: 0;
  }

  .combobox-empty {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 0.875rem;
    color: var(--color-text-muted);
    text-align: center;
  }
</style>
