<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <AppNav />
  <div class="card">
    <h3>QQ群</h3>
    <p></p>
    <div class="action">
      <a href="https://qm.qq.com/q/rmjRaGFt0O" target="_blank">加入QQ群</a>
    </div>
  </div>
  <footer class="footer">
    <p class="rainyun-link">
      本服务器，域名由
      <a href="https://app.rainyun.com/" target="_blank" rel="noopener">
        <img src="https://app.rainyun.com/img/logo.d193755d.png" alt="Rainyun" />
        <span>Rainyun提供</span>
      </a>
    </p>
    <p>网站搭建: lanyinxianxuan</p>
    <p>网站维护: lanyinxuanxuan</p>
    <p>联系我们: lanyinxianxuan@163.com</p>
    <p>版权所有 &copy; 2024–2025 糖豆方块屋</p>
  </footer>
</template>

<style scoped>
.card {
  max-width: 400px;
  margin: 10vh auto;
  padding: 2.5rem;
  background: var(--bg-primary, #ffffff);
  border-radius: var(--radius-md, 4px);
  border: 1px solid var(--border-color, #e0e0e0);
  text-align: center;
}

.card h3 {
  text-align: center;
  color: var(--text-primary, #1a1a1a);
  font-size: 1.3rem;
  font-weight: 600;
}

.card .action {
  margin-top: 1.5rem;
}

.card a {
  display: inline-block;
  padding: 0.7rem 2rem;
  background: var(--accent, #1a1a1a);
  color: var(--bg-primary, #ffffff);
  border-radius: var(--radius-sm, 2px);
  text-decoration: none;
  font-size: 0.95rem;
  transition: background 0.2s;
}

.card a:hover {
  background: var(--accent-hover, #000000);
}

.footer {
  text-align: center;
  padding: 2rem;
  font-size: 0.85rem;
  color: var(--text-tertiary, #999);
}

.footer p {
  margin: 0.25rem 0;
}

.rainyun-link a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary, #666);
}

.rainyun-link img {
  height: 18px;
}

.footer a:hover {
  color: var(--text-primary, #1a1a1a);
}
</style>
