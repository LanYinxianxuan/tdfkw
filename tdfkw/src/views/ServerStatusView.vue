<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { request } from '@/utils/request.js'

// ---- MC 服务器状态 ----
const mc = ref(null)
const mcLoading = ref(true)
const mcError = ref(false)

async function fetchMcStatus() {
  try {
    const { ok, data } = await request('/api/monitor/minecraft')
    if (ok) mc.value = data.data
    else mcError.value = true
  } catch {
    mcError.value = true
  } finally {
    mcLoading.value = false
  }
}

// ---- 系统指标 ----
const sys = ref(null)
const sysLoading = ref(true)

async function fetchSystem() {
  sysLoading.value = true
  try {
    const { ok, data } = await request('/api/monitor/system')
    if (ok) sys.value = data.data
  } catch { /* 静默 */ }
  finally { sysLoading.value = false }
}

// ---- 网站健康 ----
const health = ref(null)

async function fetchHealth() {
  try {
    const { ok, data } = await request('/api/monitor/health')
    if (ok) health.value = data.data
  } catch { /* 静默 */ }
}

// ---- 格式工具 ----
function uptimeDisplay(s) {
  if (!s && s !== 0) return '—'
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `${d}d ${h}h ${m}m`
}

function fmtGB(kb) {
  if (!kb) return '—'
  return (kb / 1024**2).toFixed(1) + ' GB'
}

// ---- 轮询 ----
let mcTimer, healthTimer

onMounted(() => {
  fetchMcStatus()
  fetchSystem()
  fetchHealth()
  mcTimer = setInterval(fetchMcStatus, 60000)
  healthTimer = setInterval(fetchHealth, 120000)
})

onUnmounted(() => {
  clearInterval(mcTimer)
  clearInterval(healthTimer)
})
</script>

<template>
  <div class="monitor-page">
    <!-- ====== MC 服务器状态 ====== -->
    <div class="card mc-card">
      <div class="card-hdr">
        <h3>Minecraft 服务器</h3>
        <span class="badge" :class="mc?.online ? 'online' : 'offline'">
          {{ mcLoading ? '查询中…' : mc?.online ? '在线' : '离线' }}
        </span>
      </div>

      <div v-if="mc" class="card-body mc-body">
        <div class="mc-grid">
          <div class="mc-cell">
            <span class="mc-label">地址</span>
            <span class="mc-val">{{ mc.hostname }}:{{ mc.port }}</span>
          </div>
          <div class="mc-cell">
            <span class="mc-label">版本</span>
            <span class="mc-val">{{ mc.version || '—' }}</span>
          </div>
          <div class="mc-cell span-2">
            <span class="mc-label">MOTD</span>
            <span class="mc-val motd">{{ mc.motd || '—' }}</span>
          </div>
        </div>

        <!-- 玩家数进度条 -->
        <div class="player-bar-wrap">
          <div class="player-bar-hdr">
            <span>玩家</span>
            <span><strong>{{ mc.players_online }}</strong> / {{ mc.players_max }}</span>
          </div>
          <div class="player-bar-track">
            <div
              class="player-bar-fill"
              :style="{ width: mc.players_max ? (mc.players_online / mc.players_max * 100) + '%' : '0%' }"
            ></div>
          </div>
        </div>

        <!-- 在线玩家名 -->
        <div v-if="mc.players?.length" class="player-list">
          <span v-for="p in mc.players" :key="p" class="player-tag">{{ p }}</span>
        </div>
      </div>

      <div class="card-ft">
        <span v-if="mc?.fetched_at">更新于 {{ new Date(mc.fetched_at).toLocaleTimeString('zh-CN') }}</span>
        <button class="btn-refresh" @click="fetchMcStatus" :disabled="mcLoading">刷新</button>
      </div>
    </div>

    <!-- ====== 系统指标 ====== -->
    <div class="card sys-card">
      <div class="card-hdr">
        <h3>系统指标</h3>
        <span v-if="sys?.node_only" class="badge offline">未配置</span>
        <span v-else-if="sys?.error" class="badge offline">不可用</span>
      </div>

      <div v-if="sysLoading" class="card-body"><p class="muted">加载中…</p></div>

      <div v-else-if="sys?.node_only" class="card-body">
        <p class="muted">系统指标需要在 .dev.vars 中配置 MONITOR_HOST 和 MONITOR_TOKEN 后才可用。</p>
      </div>

      <div v-else-if="sys?.error" class="card-body">
        <p class="muted">{{ sys.message || '无法获取系统指标' }}</p>
      </div>

      <div v-else-if="sys" class="card-body sys-body">
        <!-- CPU -->
        <div class="metric-row">
          <span class="metric-label">CPU</span>
          <div class="metric-bar-track">
            <div class="metric-bar-fill cpu" :style="{ width: (sys.cpu?.percent || 0) + '%' }"></div>
          </div>
          <span class="metric-num">{{ sys.cpu?.percent ?? '—' }}%</span>
        </div>

        <!-- 内存 -->
        <div class="metric-row">
          <span class="metric-label">内存</span>
          <div class="metric-bar-track">
            <div class="metric-bar-fill mem" :style="{ width: (sys.memory?.percent || 0) + '%' }"></div>
          </div>
          <span class="metric-num">{{ fmtGB(sys.memory?.used_kb) }} / {{ fmtGB(sys.memory?.total_kb) }}</span>
        </div>

        <!-- 磁盘 -->
        <div class="metric-row">
          <span class="metric-label">磁盘</span>
          <div class="metric-bar-track">
            <div class="metric-bar-fill disk" :style="{ width: (sys.disk?.percent || 0) + '%' }"></div>
          </div>
          <span class="metric-num">{{ sys.disk?.used_gb ?? '—' }} / {{ sys.disk?.total_gb ?? '—' }} GB</span>
        </div>

        <!-- 负载 -->
        <div class="metric-text-row" v-if="sys.load">
          <span class="metric-label">负载</span>
          <span class="metric-num">{{ sys.load.load1 }} / {{ sys.load.load5 }} / {{ sys.load.load15 }}</span>
        </div>

        <!-- 网络 -->
        <div class="metric-text-row" v-if="sys.network">
          <span class="metric-label">网络</span>
          <span class="metric-num">↓ {{ sys.network.rx_mb }} MB &nbsp; ↑ {{ sys.network.tx_mb }} MB</span>
        </div>

        <!-- 运行时间 -->
        <div class="metric-text-row" v-if="sys.uptime">
          <span class="metric-label">运行时间</span>
          <span class="metric-num">{{ sys.uptime.display || uptimeDisplay(sys.uptime.seconds) }}</span>
        </div>
      </div>

      <div class="card-ft">
        <button class="btn-refresh" @click="fetchSystem" :disabled="sysLoading">刷新</button>
      </div>
    </div>

    <!-- ====== 网站健康 ====== -->
    <div class="card health-card">
      <div class="card-hdr">
        <h3>网站健康</h3>
      </div>

      <div v-if="health" class="card-body health-body">
        <div class="health-row">
          <span class="health-label">API 服务</span>
          <span class="health-dot" :class="health.api"></span>
          <span class="health-val">{{ health.api === 'ok' ? '正常' : '异常' }}</span>
        </div>
        <div class="health-row">
          <span class="health-label">数据库</span>
          <span class="health-dot" :class="health.database"></span>
          <span class="health-val">{{ health.database === 'ok' ? '正常' : '异常' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.monitor-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 800px;
}

/* ---- 卡片头尾 ---- */
.card-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-md);
}

.card-hdr h3 {
  font-size: 1rem;
  font-weight: 600;
}

.card-ft {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-md);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-border);
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

/* ---- 状态徽章 ---- */
.badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 99px;
}

.badge.online {
  background: #ecfdf5;
  color: #059669;
}

.badge.offline {
  background: #fef2f2;
  color: #dc2626;
}

/* ---- 通用 ---- */
.muted {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.card-body {
  padding: 0;
}

.btn-refresh {
  font-size: 0.8rem;
  padding: 4px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-refresh:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text);
}

/* ---- MC 卡片 ---- */
.mc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.mc-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mc-cell.span-2 {
  grid-column: 1 / -1;
}

.mc-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.mc-val {
  font-size: 0.95rem;
  font-weight: 500;
}

.mc-val.motd {
  color: var(--color-text-secondary);
  white-space: pre-line;
}

/* ---- 玩家进度条 ---- */
.player-bar-wrap {
  margin-top: var(--space-md);
}

.player-bar-hdr {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 4px;
  color: var(--color-text-secondary);
}

.player-bar-track {
  height: 8px;
  background: var(--color-bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.player-bar-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* ---- 玩家标签 ---- */
.player-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--space-sm);
}

.player-tag {
  font-size: 0.8rem;
  padding: 2px 8px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

/* ---- 系统指标 ---- */
.metric-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.metric-text-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
}

.metric-label {
  width: 48px;
  flex-shrink: 0;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.metric-bar-track {
  flex: 1;
  height: 10px;
  background: var(--color-bg-tertiary);
  border-radius: 5px;
  overflow: hidden;
}

.metric-bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.8s ease;
}

.metric-bar-fill.cpu { background: #6366f1; }
.metric-bar-fill.mem { background: #22c55e; }
.metric-bar-fill.disk { background: #f59e0b; }

.metric-num {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  min-width: 60px;
  text-align: right;
}

/* ---- 健康检查 ---- */
.health-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.health-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.health-label {
  width: 72px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.health-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.health-dot.ok {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34,197,94,0.4);
}

.health-dot.error {
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239,68,68,0.4);
}

.health-val {
  font-size: 0.85rem;
  font-weight: 500;
}
</style>
