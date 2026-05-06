<script setup>
import { RouterView } from 'vue-router'
</script>
<template>
  <router-view />
  <AppToast />
  <footer class="site-footer">
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
.site-footer {
  text-align: center;
  padding: 2rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.site-footer p {
  margin: 0.25rem 0;
}

.rainyun-link a {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-text-secondary);
}

.rainyun-link img {
  height: 18px;
}

.site-footer a {
  color: var(--color-text-secondary);
}

.site-footer a:hover {
  color: var(--color-text);
}
</style>