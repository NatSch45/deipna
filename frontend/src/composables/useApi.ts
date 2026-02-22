import { ref } from 'vue'

interface UseApiOptions<T> {
  immediate?: boolean
  initialValue?: T
}

export function useApi<T, P extends unknown[] = []>(
  apiFunction: (...args: P) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const { initialValue } = options

  const data = ref<T | undefined>(initialValue) as { value: T | undefined }
  const error = ref<Error | null>(null)
  const isLoading = ref(false)

  async function execute(...args: P): Promise<T | undefined> {
    isLoading.value = true
    error.value = null

    try {
      const result = await apiFunction(...args)
      data.value = result
      return result
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Unknown error')
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    data.value = initialValue
    error.value = null
    isLoading.value = false
  }

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  }
}
