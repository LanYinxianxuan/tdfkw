<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import CryptoJS from 'crypto-js'
import router from '@/router'
import { request } from '@/utils/request'
import { useToast } from '@/utils/toast.js'

const userStore = useUserStore()
const toast = useToast()

const username = ref('')
const password = ref('')
const isLoading = ref(false)

const login = async () => {
  isLoading.value = true
  try {
    const hashPassword = CryptoJS.SHA256(password.value).toString()
    const { ok, data } = await request('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: hashPassword }),
    })
    if (ok && data.success) {
      userStore.setUser(data.data.user, data.data.token)
      username.value = ''
      password.value = ''
      router.push(`/dashboard?userid=${data.data.user.id}`)
    } else {
      toast.error(data.error || '登录失败')
    }
  } catch (error) {
    console.error('登录错误:', error)
    toast.error('网络错误，请稍后重试')
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <AppNav />
  <div class="app">
    <div class="logIn">
      <h2>登入糖豆方块屋</h2>
      <input type="text" v-model="username" placeholder="请输入用户名" />
      <input type="password" v-model="password" placeholder="请输入密码" />
      <a @click="login" class="login-btn" :class="{ loading: isLoading }">
        {{ isLoading ? '登录中...' : '登入' }}
      </a>
    </div>
    <div class="register">
      <h2>注册账号</h2>
      <RouterLink to="/register">注册</RouterLink>
      <!-- <span v-else>{{ statusText }}</span> -->
    </div>
  </div>
</template>
<style scoped>
.app {
  display: flex;
  height: calc(100vh - 60px);
}

.logIn,
.register {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.logIn {
  background: var(--color-bg);
  border-right: 1px solid var(--color-border);
}

.register {
  background: var(--color-bg-secondary);
}

.logIn h2,
.register h2 {
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.logIn input {
  width: 280px;
  margin-bottom: 1rem;
}

.logIn a,
.register a,
.login-btn {
  display: inline-block;
  padding: 0.7rem 2rem;
  background: var(--color-accent);
  color: var(--color-bg);
  text-decoration: none;
  border-radius: var(--radius-sm);
  margin-top: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background 0.2s;
}

.logIn a:hover,
.register a:hover,
.login-btn:hover {
  background: var(--color-accent-hover);
}
</style>
