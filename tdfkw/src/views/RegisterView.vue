<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const registerCode = ref('')
const postRegisterCode = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/validateRegisterCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registerCode: registerCode.value }),
    })
    const data = await response.json()
    // console.log('消息', data);
    
    if (data.valid) {
      router.push(`/whitelist?code=${data.code}`)
      // 注册码有效，继续注册流程
    } else {
      alert('注册码无效或已过期')
    }
  } catch (error) {
    console.error('Error validating register code:', error)
  }
}
</script>
<template>
  <AppNav />
  <div class="app">
    <div class="container">
      <h2>注册流程</h2>
      <ul>
        <li>
          <a href="https://qm.qq.com/q/rmjRaGFt0O" target="_blank"> 加入QQ群 </a>
          <span>完成审核表单</span>
        </li>
        <li>等待审核通过后管理员会发送72h内有效的注册码</li>
        <li>收到注册码后，按照提示完成注册流程</li>
      </ul>
      <input type="password" placeholder="请输入注册码" v-model="registerCode" />
      <button class="btn" @click="postRegisterCode">现在开始</button>
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
  max-width: 480px;
  width: 90%;
}

.container h2 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary, #1a1a1a);
  text-align: center;
  font-size: 1.4rem;
  font-weight: 600;
}

.container ul {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.container li {
  margin-bottom: 0.75rem;
  padding: 0.8rem 1rem;
  background: var(--bg-secondary, #f5f5f5);
  border-left: 2px solid var(--accent, #1a1a1a);
  border-radius: var(--radius-sm, 2px);
  color: var(--text-secondary, #666);
  font-size: 0.9rem;
}

.container li a {
  color: var(--text-primary, #1a1a1a);
  font-weight: 500;
  transition: color 0.2s;
}

.container li a:hover {
  color: var(--accent-hover, #000000);
}

.container li span {
  margin-left: 0.5rem;
}

.container input {
  margin-bottom: 1rem;
}

.container .btn {
  margin-top: 0.5rem;
}
</style>
