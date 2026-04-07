<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppNav from '@/components/NAV.vue'

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
      <button>登入</button>
    </div>
    <div class="register">
      <h2>注册账号</h2>
      <RouterLink v-if="registerIsReady" to="/register">{{ statusText }}</RouterLink>
      <span v-else>{{ statusText }}</span>
    </div>
  </div>
</template>
