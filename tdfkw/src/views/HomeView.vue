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
<style scoped>
.main {
  display: flex;
  flex-direction: column;
}

.main .d {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  padding: 2rem;
}

.main .d h1 {
  color: var(--text-primary, #1a1a1a);
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}

.main .d main {
  color: var(--text-secondary, #666);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  text-align: center;
  line-height: 1.6;
}

.main .d button {
  padding: 0.8rem 2.5rem;
  background: var(--accent, #1a1a1a);
  color: var(--bg-primary, #ffffff);
  border: none;
  border-radius: var(--radius-sm, 2px);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.main .d button:hover {
  background: var(--accent-hover, #000000);
}

.main .d button:active {
  transform: scale(0.98);
}

.a {
  height: 20vh;
  background: var(--bg-tertiary, #e8e8e8);
}
</style>
