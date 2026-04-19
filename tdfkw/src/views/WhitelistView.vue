<script setup>
import { ref, onMounted } from 'vue' 
import { useRoute } from 'vue-router'
import CryptoJS from 'crypto-js';

const route = useRoute()
const code = ref('')
const email = ref('')
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
    const response = await fetch('http://localhost:3000/api/send-otp',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, code: code.value})
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
      body: JSON.stringify({ code: code.value, email: email.value, otp: optCode.value, password: hashPassword, username: username.value })
    })
    if (respone.ok) {
      alert('验证码正确')
    } else {
      const data = await respone.json()
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
      <input type="text" placeholder="与你的游戏名相同" v-model="username"/>
      <label for=""> 邮箱 </label>
      <input type="email" name="" id="" v-model="email"/>
      <label for=""> 邮箱验证码 </label>
      <div class="input-with-button">
        <input type="text" v-model="optCode" />
        <span class="send-btn" @click="sendCode">发送验证码</span>
      </div>
      <label for=""> 密码 </label>
      <input type="password" name="" id="" v-model="password"/>
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
  background: #f5f5f5;
}

form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  color: #333;
  font-weight: bold;
  font-size: 0.95rem;
}

input[type='text'],
input[type='email'],
input[type='password'] {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.input-with-button {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.input-with-button input {
  width: 100%;
  margin-bottom: 0 !important;
  padding-right: 100px;
}

.send-btn {
  position: absolute;
  right: 10px;
  color: #000000;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
  user-select: none;
}

.send-btn:hover {
  color: #45a049;
}
</style>
