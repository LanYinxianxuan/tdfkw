<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

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
    <div class="container">
      <h1>欢迎，{{ userStore.user?.username }}！</h1>
      <div class="info">
        <p><strong>用户ID:</strong> {{ userStore.user?.id }}</p>
        <p><strong>QQ:</strong> {{ userStore.user?.qq }}</p>
        <p><strong>邮箱:</strong> {{ userStore.user?.email }}</p>
      </div>
      <div class="actions">
        <button class="btn" @click="router.push('/whitelist')">申请白名单</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--bg-secondary, #f5f5f5);
}

.container {
  background: var(--bg-primary, #ffffff);
  padding: 2.5rem;
  border-radius: var(--radius-md, 4px);
  border: 1px solid var(--border-color, #e0e0e0);
  max-width: 500px;
  width: 90%;
}

h1 {
  color: var(--text-primary, #1a1a1a);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.info {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary, #f5f5f5);
  border-radius: var(--radius-sm, 2px);
}

.info p {
  margin: 0.5rem 0;
  color: var(--text-secondary, #666);
  font-size: 0.95rem;
}

.info strong {
  color: var(--text-primary, #1a1a1a);
  font-weight: 500;
}

.actions {
  text-align: center;
}

.btn {
  padding: 0.7rem 1.5rem;
  background: var(--accent, #1a1a1a);
  color: var(--bg-primary, #ffffff);
  border: none;
  border-radius: var(--radius-sm, 2px);
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn:hover {
  background: var(--accent-hover, #000000);
}
</style>