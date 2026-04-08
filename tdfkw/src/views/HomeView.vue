<script setup>

</script>
<template>
  <AppNav />
  <div class="logo">
    <h1 class="logo-h1">糖豆方块屋</h1>
  </div>
  <div class="a">
    <!-- <a @click="router.push('/start')">现在开始</a> -->
     <router-link to="/start">现在开始</router-link>
  </div>
  
</template>
<style>
.logo {
  background-color: rgb(72, 255, 0);
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo-h1 {
  margin: 0;
  font-size: 3rem;
}
.a {
  display: flex;
  justify-content: center;
}
</style>
