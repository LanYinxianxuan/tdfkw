<script setup></script>
<template>
  <AppNav />
  <div class="app">
    <form action="">
      <label for=""> 用户名 </label>
      <input type="text" placeholder="与你的游戏名相同" />
      <label for=""> 邮箱 </label>
      <input type="email" name="" id="" />
      <label for=""> 邮箱验证码 </label>
      <input type="text" />
      <label for=""> 密码 </label>
      <input type="password" name="" id="" />
      <input type="button" value="注册" @click="$router.push('/dashboard')" />
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
  margin-bottom: 0.5rem;
}
</style>
