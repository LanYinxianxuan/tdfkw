import { ref } from 'vue'

const toasts = ref([])
let id = 0

export function useToast() {
  function show(message, type = 'info') {
    const currentId = ++id
    toasts.value.push({ id: currentId, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== currentId)
    }, 4000)
  }

  function success(message) {
    show(message, 'success')
  }

  function error(message) {
    show(message, 'error')
  }

  function info(message) {
    show(message, 'info')
  }

  return { toasts, success, error, info }
}
