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
    if (data.valid) {
      router.push(`/detail/${data.id}`)
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
  background: #f5f5f5;
}

.container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.container h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  text-align: center;
}

.container ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.container li {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-left: 3px solid #667eea;
  border-radius: 4px;
}

.container li a {
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.container li a:hover {
  color: #5a6fd8;
}

.container li span {
  margin-left: 0.5rem;
  color: #666;
}
</style>
