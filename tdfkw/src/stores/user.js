import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { request } from '@/utils/request'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => user.value !== null)

  function setUser(userData, token) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
    if (token) {
      localStorage.setItem('token', token)
    }
  }

  async function loadUser() {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const { ok, data } = await request('/api/me')
      if (ok && data.success) {
        user.value = data.data.user
      } else {
        logout()
      }
    } catch {
      logout()
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return { user, isLoggedIn, setUser, loadUser, logout }
})
