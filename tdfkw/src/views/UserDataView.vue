<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const content = ref('暂无公告')
const sponsorContent = ref('暂无赞助信息')
</script>
<template>
  <div class="dashboard-row">
    <div class="user_data card">
      <img :src="`https://q.qlogo.cn/g?b=qq&nk=${userStore.user?.qq}&s=100`" class="qq_image" />
      <div class="da">
        <p>用户名: {{ userStore.user?.username }}</p>
        <p>QQ: {{ userStore.user?.qq }}</p>
        <p>邮箱: {{ userStore.user?.email }}</p>
      </div>
    </div>
    <div class="panel card">
      <h1>公告栏</h1>
      <hr class="divider" />
      <p>{{ content }}</p>
    </div>
    <div class="panel card">
      <h1>赞助</h1>
      <hr class="divider" />
      <p>{{ sponsorContent }}</p>
    </div>
  </div>
</template>
<style scoped>
.dashboard-row {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-md);
}

.user_data {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  flex-shrink: 0;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.panel hr {
  width: 100%;
}

.qq_image {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  cursor: pointer;
  transition: opacity 0.2s;
  border: 1px solid var(--color-border);
}
</style>
