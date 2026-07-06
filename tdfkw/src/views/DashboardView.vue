<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import SecNav from '@/components/SecNav.vue'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  userStore.loadUser()
  if (!userStore.isLoggedIn) {
    router.push('/start')
  }
})
</script>

<template>
  <AppNav />
  <div class="dashboard-layout">
    <aside class="sidebar-col">
      <SecNav />
    </aside>
    <main class="main-col">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  align-items: stretch;
  min-height: calc(100vh - 60px);
}

.sidebar-col {
  width: 180px;
  flex-shrink: 0;
  border-right: 1px solid var(--color-border);
  background: var(--color-bg);
}

.main-col {
  flex: 1;
  min-width: 0;
  padding: var(--space-lg);
  background: var(--color-bg-secondary);
}
</style>
