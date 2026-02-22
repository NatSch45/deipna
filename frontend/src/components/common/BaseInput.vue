<script setup lang="ts">
  interface Props {
    modelValue: string | number
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
    label?: string
    placeholder?: string
    error?: string
    disabled?: boolean
    required?: boolean
    id?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    disabled: false,
    required: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
    blur: [event: FocusEvent]
    focus: [event: FocusEvent]
  }>()

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value)
  }
</script>

<template>
  <div class="input-wrapper">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="['input', { 'input-error': error }]"
      @input="handleInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .input-label {
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--color-text);
  }

  .required-mark {
    color: var(--color-danger);
  }

  .input {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background-color: var(--color-background);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }

  .input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.1);
  }

  .input:disabled {
    background-color: var(--color-background-mute);
    cursor: not-allowed;
  }

  .input-error {
    border-color: var(--color-danger);
  }

  .input-error:focus {
    border-color: var(--color-danger);
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
  }

  .error-message {
    font-size: 0.75rem;
    color: var(--color-danger);
  }
</style>
