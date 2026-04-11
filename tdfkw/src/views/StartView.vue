<script setup>
import { ref, computed } from 'vue'
const registerIsReady = ref(true) // 这里可以根据实际情况设置为 true 或 false
const statusText = computed(() => {
  return registerIsReady.value ? '注册已经开放' : '注册尚未开放'
})
</script>
<template>
  <AppNav />
  <div class="app">
    <div class="logIn">
      <h2>登入糖豆方块屋</h2>
      <input type="text" placeholder="请输入用户名" />
      <input type="password" placeholder="请输入密码" />
      <RouterLink to="/dashboard">登入</RouterLink>
    </div>
    <div class="register">
      <h2>注册账号</h2>
      <RouterLink v-if="registerIsReady" to="/register">{{ statusText }}</RouterLink>
      <span v-else>{{ statusText }}</span>
    </div>
  </div>
</template>
<style>
.app {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  font-family: Arial, sans-serif;
}

.logIn,
.register {
  flex: 1;
  height: 100%;
  background: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logIn h2,
.register h2 {
  margin-bottom: 1rem;
  color: #333;
}

.logIn a,
.register a {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 1rem;
  transition: background 0.3s;
}

.logIn a:hover,
.register a:hover {
  background: #5a6fd8;
}

.register span {
  color: #666;
  font-size: 0.9rem;
}
</style>
