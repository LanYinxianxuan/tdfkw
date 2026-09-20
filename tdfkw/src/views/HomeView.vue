<script setup></script>
<template>
  <AppNav />
  <div class="main">
    <div class="hero">
      <h1>欢迎来到糖豆方块屋</h1>
      <p>我们是糖豆方块屋，一个由学生们运营的我的世界生电服务器</p>
      <button @click="$router.push('/start')" ,class="start">现在开始</button>
    </div>
  </div>
  <div class="footer-band"></div>
</template>
<style scoped>
.main {
  display: flex;
  flex-direction: column;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}

.hero p {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  text-align: center;
  line-height: 1.6;
}

.hero button {
  padding: 0.8rem 2.5rem;
  background: var(--color-accent);
  color: var(--color-bg);
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}
@keyframes amplify
{
    from {padding: 0.8rem 2.5rem; font-size: 1rem;}
    to {padding: 1.0rem 2.7rem; font-size: 1.2rem;}
}
 
@-webkit-keyframes amplify
{
    from {padding: 0.8rem 2.5rem; font-size: 1rem;}
    to {padding: 1.0rem 2.7rem; font-size: 1.2rem;}
}

.hero button:hover {
  background: var(--color-accent-hover);
  box-shadow: var(--animation-shadow-hover);
  animation: amplify 0.3s ease forwards;
  -webkit-animation: amplify 0.3s ease forwards;
}

.hero button:active {
  transform: scale(0.98);
}

.footer-band {
  height: 20vh;
  background: var(--color-bg-tertiary);
}
</style>
