<script setup>
import { useToast } from '@/utils/toast.js'

const { toasts } = useToast()
</script>

<template>
  <div class="toast-container">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast-item"
      :class="t.type"
    >
      {{ t.message }}
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast-item {
  padding: 12px 20px;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: #fff;
  animation: toast-in 0.3s ease;
  max-width: 360px;
  word-break: break-all;
}

.toast-item.success { background: #22c55e; }
.toast-item.error { background: #ef4444; }
.toast-item.info { background: var(--color-text-secondary); }

@keyframes toast-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
