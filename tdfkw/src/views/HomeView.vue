<script setup></script>
<template>
  <AppNav />
  <div class="main">
    <div class="d">
      <h1>欢迎来到糖豆方块屋</h1>
      <main>我们是糖豆方块屋，一个由学生们运营的我的世界生电服务器</main>
      <button @click="$router.push('/start')">现在开始</button>
    </div>
  </div>
  <div class="a"></div>
</template>
<style>
.main .d {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}
</style>
