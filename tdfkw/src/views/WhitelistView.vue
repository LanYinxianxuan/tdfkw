<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import CryptoJS from 'crypto-js'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const code = ref('')
const email = ref('')
const qq = ref('')

const username = ref('')
const optCode = ref('')
const password = ref('')

onMounted(() => {
  const codeFromUrl = route.query.code
  if (codeFromUrl) {
    code.value = codeFromUrl
  }
})
const sendCode = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, code: code.value, qq: qq.value }),
    })
    if (response.ok) {
      alert('验证码已发送')
    } else {
      const data = await response.json()
      alert(data.message || '发送失败，请重试')
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
  }
}
const checkCodeARegister = async () => {
  try {
    const hashPassword = CryptoJS.SHA256(password.value).toString()
    const respone = await fetch('http://localhost:3000/api/check-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.value, email: email.value, otp: optCode.value, password: hashPassword, username: username.value, qq: qq.value })
    })
    const data = await respone.json()
    if (respone.ok && data.valid) {
      userStore.setUser(data.user)
      router.push(`/dashboard?userid=${data.user.id}`)
    } else {
      alert(data.message || '验证码错误，请重试')
    }
  } catch (error) {
    console.error('Error checking OTP:', error)
  }
}
</script>
<template>
  <AppNav />
  <div class="app">
    <form action="">
      <label for=""> 用户名 </label>
      <input type="text" placeholder="与你的游戏名相同" v-model="username" />
      <label for="">QQ</label>
      <input type="text" name="" id="" v-model="qq" />
      <label for=""> 邮箱 </label>
      <input type="email" name="" id="" v-model="email" />
      <label for=""> 邮箱验证码 </label>
      <div class="input-with-button">
        <input type="text" v-model="optCode" />
        <span class="send-btn" @click="sendCode">发送验证码</span>
      </div>
      <label for=""> 密码 </label>
      <input type="password" name="" id="" v-model="password" />
      <input type="button" value="注册" @click="checkCodeARegister" />
    </form>
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

form {
  background: var(--bg-primary, #ffffff);
  padding: 2.5rem;
  border-radius: var(--radius-md, 4px);
  border: 1px solid var(--border-color, #e0e0e0);
  max-width: 400px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: var(--text-primary, #1a1a1a);
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

label:first-child {
  margin-top: 0;
}

input[type='text'],
input[type='email'],
input[type='password'] {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: var(--radius-sm, 2px);
  margin-bottom: 0;
}

.input-with-button {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-button input {
  padding-right: 80px;
}

.send-btn {
  position: absolute;
  right: 10px;
  color: var(--text-secondary, #666);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  user-select: none;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm, 2px);
  transition: color 0.2s, background 0.2s;
}

.send-btn:hover {
  color: var(--text-primary, #1a1a1a);
  background: var(--bg-tertiary, #e8e8e8);
}

input[type='button'] {
  margin-top: 0.5rem;
}
</style>
