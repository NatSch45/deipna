<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

  interface Option {
    value: string
    label: string
  }

  interface Props {
    modelValue: string[]
    options: Option[]
    placeholder?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Sélectionner...',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string[]]
  }>()

  const triggerRef = ref<HTMLElement | null>(null)
  const dropdownRef = ref<HTMLElement | null>(null)
  const isOpen = ref(false)
  const dropdownStyle = ref<{ top: string; left: string; width: string }>({
    top: '0px',
    left: '0px',
    width: '0px',
  })

  const displayLabel = computed(() => {
    if (props.modelValue.length === 0) return null
    if (props.modelValue.length === 1) {
      return props.options.find((o) => o.value === props.modelValue[0])?.label ?? ''
    }
    return `${props.modelValue.length} sélectionnés`
  })

  function computePosition() {
    if (!triggerRef.value) return
    const rect = triggerRef.value.getBoundingClientRect()
    dropdownStyle.value = {
      top: `${rect.bottom + window.scrollY + 4}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`,
    }
  }

  async function openDropdown() {
    computePosition()
    isOpen.value = true
    await nextTick()
  }

  function closeDropdown() {
    isOpen.value = false
  }

  function toggle() {
    if (isOpen.value) closeDropdown()
    else openDropdown()
  }

  function toggleOption(value: string) {
    const current = props.modelValue
    if (current.includes(value)) {
      emit('update:modelValue', current.filter((v) => v !== value))
    } else {
      emit('update:modelValue', [...current, value])
    }
  }

  function clearAll(event: MouseEvent) {
    event.stopPropagation()
    emit('update:modelValue', [])
  }

  function onClickOutside(event: MouseEvent) {
    const target = event.target as Node
    if (
      triggerRef.value?.contains(target) ||
      dropdownRef.value?.contains(target)
    ) return
    closeDropdown()
  }

  function onScroll() {
    if (isOpen.value) computePosition()
  }

  onMounted(() => {
    document.addEventListener('mousedown', onClickOutside)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onClickOutside)
    window.removeEventListener('scroll', onScroll, true)
    window.removeEventListener('resize', onScroll)
  })
</script>

<template>
  <div class="multiselect">
    <button
      ref="triggerRef"
      type="button"
      class="multiselect-trigger"
      :class="{ open: isOpen, 'has-value': modelValue.length > 0 }"
      @click="toggle"
    >
      <span class="multiselect-label">{{ displayLabel ?? placeholder }}</span>
      <span v-if="modelValue.length > 0" class="multiselect-badge">{{ modelValue.length }}</span>
      <button
        v-if="modelValue.length > 0"
        type="button"
        class="multiselect-clear"
        tabindex="-1"
        @mousedown="clearAll"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
      <span class="multiselect-chevron" :class="{ rotated: isOpen }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </span>
    </button>

    <Teleport to="body">
      <ul
        v-if="isOpen"
        ref="dropdownRef"
        class="multiselect-dropdown"
        :style="dropdownStyle"
      >
        <li
          v-for="option in options"
          :key="option.value"
          class="multiselect-option"
          :class="{ selected: modelValue.includes(option.value) }"
          @mousedown.prevent="toggleOption(option.value)"
        >
          <span class="multiselect-checkbox" :class="{ checked: modelValue.includes(option.value) }">
            <svg v-if="modelValue.includes(option.value)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </span>
          {{ option.label }}
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<style scoped>
  .multiselect {
    position: relative;
    height: 42px;
  }

  .multiselect-trigger {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    width: 100%;
    height: 42px;
    padding: 0 var(--spacing-sm) 0 var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background-color: var(--color-background);
    font-size: 1rem;
    color: var(--color-text-light);
    cursor: pointer;
    text-align: left;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }

  .multiselect-trigger.has-value {
    color: var(--color-text);
  }

  .multiselect-trigger.open {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.15);
  }

  .multiselect-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }

  .multiselect-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 999px;
    background-color: var(--color-primary);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .multiselect-clear {
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

  .multiselect-clear:hover {
    color: var(--color-danger);
    background-color: var(--color-background-mute);
  }

  .multiselect-chevron {
    display: flex;
    align-items: center;
    color: var(--color-text-muted);
    transition: transform var(--transition-fast);
    flex-shrink: 0;
  }

  .multiselect-chevron.rotated {
    transform: rotate(180deg);
  }
</style>

<style>
  .multiselect-dropdown {
    position: absolute;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    z-index: 9999;
    max-height: 240px;
    overflow-y: auto;
    list-style: none;
    padding: 0.25rem 0;
  }

  .multiselect-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.925rem;
    cursor: pointer;
    color: var(--color-text);
    transition: background-color 150ms ease;
    user-select: none;
  }

  .multiselect-option:hover {
    background-color: var(--color-background-soft);
  }

  .multiselect-option.selected {
    color: var(--color-primary);
    font-weight: 500;
  }

  .multiselect-checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 2px solid var(--color-border);
    border-radius: 4px;
    flex-shrink: 0;
    transition: border-color 150ms ease, background-color 150ms ease;
  }

  .multiselect-checkbox.checked {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: #fff;
  }
</style>
