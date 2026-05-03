<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  {
    label: '仪表盘',
    to: '/dashboard/userdata',
    icon: 'M512 42.7C794.8 42.7 1024 271.9 1024 554.7c0 158.1-71.7 299.5-184.3 393.4l-54.6-65.6A425.8 425.8 0 0 0 938.7 554.7c0-235.6-191-426.7-426.7-426.7S85.3 319 85.3 554.7a425.8 425.8 0 0 0 153.5 327.8l-54.6 65.5A510.9 510.9 0 0 1 0 554.7C0 271.9 229.2 42.7 512 42.7zm255.6 237.6L578.2 554.7H512l0.9-63.8 254.7-210.6z',
  },
  {
    label: '档案',
    to: '/dashboard/files',
    icon: 'M224.5 959.5H96c-17.7 0-32-14.3-32-32v-831c0-17.7 14.3-32 32-32h128.5c17.7 0 32 14.3 32 32v831c0 17.7-14.3 32-32 32zM0 64.5v895c0 35.3 28.7 64 64 64h192.5c35.3 0 64-28.7 64-64v-895c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64zm576.5 895H448c-17.7 0-32-14.3-32-32v-831c0-17.7 14.3-32 32-32h128.5c17.7 0 32 14.3 32 32v831c0 17.7-14.3 32-32 32zm-224.5-895v895c0 35.3 28.7 64 64 64h160.5c35.3 0 64-28.7 64-64v-895c0-35.3-28.7-64-64-64H416c-35.3 0-64 28.7-64 64zm352 895H800c-17.7 0-32-14.3-32-32v-831c0-17.7 14.3-32 32-32h128.5c17.7 0 32 14.3 32 32v831c0 17.7-14.3 32-32 32zm-224.5-895v895c0 35.3 28.7 64 64 64h192.5c35.3 0 64-28.7 64-64v-895c0-35.3-28.7-64-64-64H768c-35.3 0-64 28.7-64 64z',
  },
]
</script>

<template>
  <nav class="sidebar">
    <router-link
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="nav-item"
      :class="{ active: route.path === item.to }"
    >
      <svg class="nav-icon" viewBox="0 0 1024 1024" width="16" height="16">
        <path :d="item.icon" fill="currentColor" />
      </svg>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-sm) var(--space-sm);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 7px 12px;
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--color-text);
  text-decoration: none;
  background: none;
  outline: none;
}

.nav-item:focus,
.nav-item:focus-visible,
.nav-item:visited {
  background: none;
  color: var(--color-text);
  outline: none;
}

.nav-item:hover {
  background-color: var(--color-bg-tertiary);
}
</style>
