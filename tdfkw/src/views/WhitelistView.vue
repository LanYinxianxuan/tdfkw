<script setup></script>
<template>
  <AppNav />
  <div class="app">
    <form action="">
        <label for="">
            用户名
        </label>
        <input type="text" placeholder="与你的游戏名相同">
        <label for="">
            邮箱
        </label>
        <input type="email" name="" id="">
        <label for="">
            邮箱验证码
        </label>
        <input type="text">
        <label for="">
            密码
        </label>
        <input type="password" name="" id="">
        <input type="button" value="注册" @click="$router.push('/dashboard')">
    </form>
  </div>
</template>
