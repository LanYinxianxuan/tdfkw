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
  <div class="app">
    <div class="sec_nav">
      <SecNav />
    </div>

    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  align-items: stretch;
}

.sec_nav {
  width: 20%;
  min-height: calc(100vh - 60px);
  border-right: 1px solid var(--color-border);
}

main {
  flex: 1;
  padding: var(--space-md);
}
</style>
