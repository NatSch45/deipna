import { reactive, ref } from 'vue'

type ValidationRule<T> = (value: T) => string | true

interface FieldConfig<T> {
  initialValue: T
  rules?: ValidationRule<T>[]
}

export function useForm<T extends Record<string, unknown>>(config: { [K in keyof T]: FieldConfig<T[K]> }) {
  const values = reactive({} as T)
  const errors = reactive({} as Record<keyof T, string>)
  const touched = reactive({} as Record<keyof T, boolean>)
  const isSubmitting = ref(false)

  // Initialize values
  for (const key in config) {
    (values as Record<string, unknown>)[key] = config[key].initialValue
    ;(errors as Record<string, string>)[key] = ''
    ;(touched as Record<string, boolean>)[key] = false
  }

  function validateField<K extends keyof T>(field: K): boolean {
    const fieldConfig = config[field]
    const value = values[field]
    ;(errors as Record<string, string>)[field as string] = ''

    if (fieldConfig.rules) {
      for (const rule of fieldConfig.rules) {
        const result = rule(value)
        if (result !== true) {
          ;(errors as Record<string, string>)[field as string] = result
          return false
        }
      }
    }

    return true
  }

  function validate(): boolean {
    let isValid = true

    for (const key in config) {
      if (!validateField(key)) {
        isValid = false
      }
    }

    return isValid
  }

  function setFieldValue<K extends keyof T>(field: K, value: T[K]) {
    ;(values as Record<string, unknown>)[field as string] = value
    ;(touched as Record<string, boolean>)[field as string] = true
    validateField(field)
  }

  function reset() {
    for (const key in config) {
      ;(values as Record<string, unknown>)[key] = config[key].initialValue
      ;(errors as Record<string, string>)[key] = ''
      ;(touched as Record<string, boolean>)[key] = false
    }
  }

  async function handleSubmit(onSubmit: (values: T) => Promise<void>) {
    if (!validate()) return

    isSubmitting.value = true
    try {
      await onSubmit(values as T)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    validateField,
    validate,
    setFieldValue,
    reset,
    handleSubmit,
  }
}

// Common validation rules
export const required = (message = 'Ce champ est requis'): ValidationRule<unknown> => {
  return (value) => {
    if (value === null || value === undefined || value === '') {
      return message
    }
    return true
  }
}

export const email = (message = 'Email invalide'): ValidationRule<string> => {
  return (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !emailRegex.test(value)) {
      return message
    }
    return true
  }
}

export const minLength = (min: number, message?: string): ValidationRule<string> => {
  return (value) => {
    if (value && value.length < min) {
      return message || `Minimum ${min} caractères requis`
    }
    return true
  }
}

export const maxLength = (max: number, message?: string): ValidationRule<string> => {
  return (value) => {
    if (value && value.length > max) {
      return message || `Maximum ${max} caractères autorisés`
    }
    return true
  }
}
