<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  {
    label: '仪表盘',
    to: '/dashboard',
    icon: 'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm87.5-334.7c34.6-40.7 55.5-92.1 55.5-148.3 0-123.5-100.3-224-224-224s-224 100.5-224 224c0 56.2 20.9 107.6 55.5 148.3L177 638.2C118.9 710.3 85.3 789.5 85.3 873.5c0 17.7 14.3 32 32 32h789.4c17.7 0 32-14.3 32-32 0-84-33.6-163.2-91.7-235.2L742.5 549.3z',
  },
  {
    label: '档案',
    to: '/dashboard/files',
    icon: 'M880 298.7H688L621.3 232H402.7l-66.7 66.7H144c-44.2 0-80 35.8-80 80v426.6c0 44.2 35.8 80 80 80h736c44.2 0 80-35.8 80-80V378.7c0-44.2-35.8-80-80-80zM144 352h149.3l66.7-66.7h226.7L653.3 352H880c14.7 0 26.6 11.9 26.6 26.7v64H117.3v-64c0-14.8 12-26.7 26.7-26.7zm736 453.3c0 14.7-11.9 26.7-26.7 26.7H144c-14.7 0-26.6-12-26.6-26.7V496h762.6v309.3z',
  },
  {
    label: '服务器',
    to: '/dashboard/server',
    icon: 'M832 128H192c-52.9 0-96 43.1-96 96v64h832v-64c0-52.9-43.1-96-96-96zM96 352v256h832V352H96zm0 320v128c0 52.9 43.1 96 96 96h640c52.9 0 96-43.1 96-96V672H96zM224 736h64v64h-64v-64zm128 0h64v64h-64v-64zm384-448H576v64h160v-64zM224 224h64v64h-64v-64zm128 0h64v64h-64v-64z',
  },
  {
    label: '工程',
    to: '/dashboard/projects',
    icon: 'M192 128h640c35.3 0 64 28.7 64 64v640c0 35.3-28.7 64-64 64H192c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64zm0 704h640V192H192v640zm128-512h384v64H320v-64zm0 128h384v64H320v-64zm0 128h256v64H320v-64z',
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
      <svg class="nav-icon" viewBox="0 0 1024 1024" width="18" height="18">
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
  padding: var(--space-md) var(--space-sm);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 9px 14px;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.15s;
}

.nav-item:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text);
}

.nav-item.active {
  background: var(--color-accent);
  color: var(--color-bg);
}

.nav-item.active .nav-icon {
  color: var(--color-bg);
}

.nav-icon {
  flex-shrink: 0;
}
</style>
