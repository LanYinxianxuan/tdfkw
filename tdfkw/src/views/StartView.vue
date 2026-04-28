<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import CryptoJS from 'crypto-js'
import router from '@/router'
import { request } from '@/utils/request'

const userStore = useUserStore()

const username = ref('')
const password = ref('')

const login = async () => {
  try {
    const hashPassword = CryptoJS.SHA256(password.value).toString()
    const response = await request('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: hashPassword }),
    })
    const data = await response
    if (response.ok && data.success) {
      userStore.setUser(data.user)
      // 登录成功，导航栏自动显示头像
      username.value = ''
      password.value = ''
      router.push(`/dashboard?userid=${data.user.id}`)
    } else {
      alert(data.error || '登录失败')
    }
  } catch (error) {
    console.error('登录错误:', error)
    alert('网络错误，请稍后重试')
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
      <a @click="login" class="login-btn">登入</a>
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
  height: 100vh;
  width: 100vw;
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
  background: var(--bg-primary, #ffffff);
  border-right: 1px solid var(--border-color, #e0e0e0);
}

.register {
  background: var(--bg-secondary, #f5f5f5);
}

.logIn h2,
.register h2 {
  margin-bottom: 2rem;
  color: var(--text-primary, #1a1a1a);
  font-size: 1.5rem;
  font-weight: 600;
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
  background: var(--accent, #1a1a1a);
  color: var(--bg-primary, #ffffff);
  text-decoration: none;
  border-radius: var(--radius-sm, 2px);
  margin-top: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background 0.2s;
}

.logIn a:hover,
.register a:hover,
.login-btn:hover {
  background: var(--accent-hover, #000000);
}
</style>
