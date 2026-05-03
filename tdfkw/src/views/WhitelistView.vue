<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import CryptoJS from 'crypto-js'
import { request } from '@/utils/request'
import AppNav from '../components/NAV.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const code = ref('')
const email = ref('')
const qq = ref('')

const username = ref('')
const otpCode = ref('')
const password = ref('')
const isLoading = ref(false)
const countdown = ref(0)

onMounted(() => {
  const codeFromUrl = route.query.code
  if (codeFromUrl) {
    code.value = codeFromUrl
  }
})

const sendCode = async () => {
  if (!email.value) {
    alert('请输入邮箱地址')
    return
  }
  if (!qq.value) {
    alert('请输入QQ号')
    return
  }

  isLoading.value = true
  try {
    const data = await request('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        code: code.value,
      }),
    })

    if (data.valid) {
      alert('✓ 验证码已发送到您的邮箱，请查收（有效期10分钟）')
      // 开启60秒倒计时
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } else {
      alert('❌ ' + (data.message || '验证码发送失败，请重试'))
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    alert('❌ 网络错误，请重试')
  } finally {
    isLoading.value = false
  }
}

const checkCodeARegister = async () => {
  if (!username.value) {
    alert('请输入用户名')
    return
  }
  if (!qq.value) {
    alert('请输入QQ号')
    return
  }
  if (!email.value) {
    alert('请输入邮箱')
    return
  }
  if (!otpCode.value) {
    alert('请输入验证码')
    return
  }
  if (!password.value) {
    alert('请输入密码')
    return
  }

  isLoading.value = true
  try {
    const hashPassword = CryptoJS.SHA256(password.value).toString()
    const data = await request('/api/check-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.value,
        email: email.value,
        otp: otpCode.value,
        password: hashPassword,
        username: username.value,
        qq: qq.value,
      }),
    })

    if (data.valid && data.user) {
      userStore.setUser(data.user)
      alert('✓ 注册成功！')
      router.push(`/dashboard?userid=${data.user.id}`)
    } else {
      alert('❌ ' + (data.message || '验证码错误或已过期，请重试'))
    }
  } catch (error) {
    console.error('Error checking OTP:', error)
    alert('❌ 网络错误，请重试')
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <AppNav />
  <div class="app">
    <form action="">
      <h2>邮箱验证注册</h2>
      <label for=""> 用户名 </label>
      <input type="text" placeholder="与你的游戏名相同" v-model="username" :disabled="isLoading" />
      <label for="">QQ</label>
      <input type="text" v-model="qq" :disabled="isLoading" />
      <label for=""> 邮箱 </label>
      <input type="email" v-model="email" :disabled="isLoading" />
      <label for=""> 邮箱验证码 </label>
      <div class="input-with-button">
        <input type="text" v-model="otpCode" :disabled="isLoading" />
        <span
          class="send-btn"
          @click="sendCode"
          :disabled="isLoading || countdown > 0"
          :class="{ disabled: isLoading || countdown > 0 }"
        >
          {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
        </span>
      </div>
      <label for=""> 密码 </label>
      <input type="password" v-model="password" :disabled="isLoading" />
      <input
        type="button"
        value="注册"
        @click="checkCodeARegister"
        :disabled="isLoading"
        :class="{ loading: isLoading }"
      />
    </form>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
}

form {
  background: var(--color-bg);
  padding: 2.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  max-width: 400px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

form h2 {
  margin: 0 0 1.5rem;
  text-align: center;
  font-size: 1.3rem;
}

label {
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

label:first-of-type {
  margin-top: 0;
}

input[type='text'],
input[type='email'],
input[type='password'] {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  margin-bottom: 0;
  transition: border-color 0.2s, opacity 0.2s;
}

input[type='text']:disabled,
input[type='email']:disabled,
input[type='password']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-bg-secondary);
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
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  user-select: none;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: color 0.2s, background 0.2s;
}

.send-btn:hover:not(.disabled) {
  color: var(--color-text);
  background: var(--color-bg-tertiary);
}

.send-btn.disabled {
  color: var(--color-text-muted);
  cursor: not-allowed;
  opacity: 0.6;
}

input[type='button'] {
  margin-top: 0.5rem;
  padding: 0.6rem;
  background: var(--color-accent);
  color: var(--color-bg);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s, background 0.2s;
}

input[type='button']:hover:not(:disabled) {
  opacity: 0.9;
}

input[type='button']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

input[type='button'].loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  right: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
