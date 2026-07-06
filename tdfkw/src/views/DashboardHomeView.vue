<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()

const announcement = ref('暂无公告')
const sponsor = ref('暂无赞助信息')
</script>

<template>
  <div class="dashboard">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner card">
      <div class="welcome-left">
        <h1 class="greeting">欢迎回来，{{ userStore.user?.username || '玩家' }}</h1>
        <p class="subtitle">糖豆方块屋 · Minecraft 社区服务器</p>
      </div>
      <div class="welcome-right">
        <img
          v-if="userStore.user?.qq"
          :src="`https://q.qlogo.cn/g?b=qq&nk=${userStore.user.qq}&s=100`"
          class="avatar"
          alt="avatar"
        />
      </div>
    </div>

    <!-- 三栏卡片 -->
    <div class="cards-row">
      <!-- 用户信息 -->
      <div class="card info-card">
        <h3 class="card-title">账号信息</h3>
        <div class="info-list">
          <div class="info-row">
            <span class="info-label">用户名</span>
            <span class="info-value">{{ userStore.user?.username }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">QQ</span>
            <span class="info-value">{{ userStore.user?.qq }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">邮箱</span>
            <span class="info-value">{{ userStore.user?.email }}</span>
          </div>
        </div>
      </div>

      <!-- 公告栏 -->
      <div class="card panel-card">
        <h3 class="card-title">公告栏</h3>
        <div class="panel-body">
          <p>{{ announcement }}</p>
        </div>
      </div>

      <!-- 赞助 -->
      <div class="card panel-card">
        <h3 class="card-title">赞助</h3>
        <div class="panel-body">
          <p>{{ sponsor }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 960px;
}

/* ——— 欢迎横幅 ——— */
.welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.greeting {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 2px;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
}

/* ——— 三栏卡片行 ——— */
.cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-md);
}

@media (max-width: 768px) {
  .cards-row {
    grid-template-columns: 1fr;
  }
}

/* ——— 卡片通用 ——— */
.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border);
}

/* ——— 用户信息 ——— */
.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.info-value {
  font-size: 0.9rem;
  font-weight: 500;
}

/* ——— 面板卡片 ——— */
.panel-body {
  min-height: 80px;
}

.panel-body p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}
</style>
