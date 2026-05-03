<script setup>
</script>

<template>
  <AppNav />
  <section class="about-section">
    <h2>关于糖豆方块屋</h2>
    <div class="content">
      <p class="rainyun-link">
        本服务器，域名由
        <a href="https://app.rainyun.com/" target="_blank" rel="noopener">
          <img src="https://app.rainyun.com/img/logo.d193755d.png" alt="Rainyun" />
          <span>Rainyun提供</span>
        </a>
      </p>
      <p>糖豆方块屋致力于为玩家提供优质游戏资源、文档与交流空间。</p>
      <p>专注Minecraft相关内容，包括服务器、皮肤、插件、模组等。</p>
      <p>网站由 <strong>lanyinxianxuan</strong> 搭建与维护，欢迎提出宝贵建议。</p>
      <p class="contact"><strong>联系方式：</strong> lanyinxianxuan@163.com</p>
    </div>
    <ul class="links">
      <li>
        <span class="label">官方网站：</span>
        <a href="https://www.tangdoufangkuaiwu.top/" target="_blank">www.tangdoufangkuaiwu.top</a>
      </li>
      <li>
        <span class="label">备用地址：</span>
        <a href="https://tdfkwweb.pages.dev/" target="_blank">tdfkwweb.pages.dev</a>
      </li>
      <li>
        <span class="label">文档中心：</span>
        <a href="https://docsify.tangdoufangkuaiwu.top/" target="_blank">docsify.tangdoufangkuaiwu.top</a>
      </li>
      <li>
        <span class="label">GitHub仓库：</span>
        <a href="https://github.com/LanYinxianxuan/tdfkw.git" target="_blank">tdfkw.git</a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.about-section {
  max-width: 700px;
  margin: 40px auto 60px;
  background: var(--color-bg, #ffffff);
  border-radius: var(--radius-lg, 6px);
  border: 1px solid var(--color-border, #e0e0e0);
  padding: 36px 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-section h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-text, #1a1a1a);
  letter-spacing: 2px;
  font-weight: 600;
}

.content {
  font-size: 1rem;
  color: var(--color-text-secondary, #666);
  line-height: 1.8;
  margin-bottom: 2rem;
  text-align: center;
}

.content p {
  margin: 0.5rem 0;
}

.content strong {
  color: var(--color-text, #1a1a1a);
  font-weight: 600;
}

.rainyun-link a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text, #1a1a1a);
}

.rainyun-link img {
  height: 18px;
}

.contact {
  color: var(--color-text, #1a1a1a);
}

.links {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.links li {
  display: flex;
  align-items: center;
}

.links .label {
  min-width: 90px;
  color: var(--color-text, #1a1a1a);
  font-weight: 500;
}

.links a {
  color: var(--color-text-secondary, #666);
  transition: color 0.2s;
}

.links a:hover {
  color: var(--color-text, #1a1a1a);
}

</style>
