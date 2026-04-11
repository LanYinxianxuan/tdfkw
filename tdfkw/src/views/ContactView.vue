<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <AppNav />
  <div class="card">
    <h3 style="text-align: center">QQ群</h3>
    <p style="text-align: center">
      <img src="/picture/qq3.png" alt="QQ群" style="width: 280px; max-width: 100%" />
    </p>
    <div style="text-align: center; margin-top: 20px">
      <a
        href="https://qm.qq.com/q/rmjRaGFt0O"
        target="_blank"
        style="
          display: inline-block;
          padding: 10px 30px;
          background-color: #25a0e2;
          color: #fff;
          border-radius: 5px;
          text-decoration: none;
          font-size: 16px;
        "
      >
        加入QQ群
      </a>
    </div>
  </div>
  <footer class="footer">
    <p>
      本服务器，域名由
      <a
        href="https://app.rainyun.com/"
        target="_blank"
        rel="noopener"
        style="display: inline-flex; align-items: center; gap: 4px"
      >
        <img
          src="https://app.rainyun.com/img/logo.d193755d.png"
          alt="Rainyun"
          style="height: 18px; vertical-align: middle; margin-right: 2px"
        />
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
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.footer {
  text-align: center;
  padding: 2rem;
  font-size: 0.9rem;
  color: #666;
}

.footer a {
  color: #25a0e2;
  text-decoration: none;
}
</style>
