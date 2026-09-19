<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { request } from '@/utils/request.js'
import { useToast } from '@/utils/toast.js'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()
const { success: toastS, error: toastE } = useToast()

const projects = ref([])
const loading = ref(true)

// ---- 创建弹窗 ----
const showCreate = ref(false)
const createForm = ref({ name: '', description: '', planner: '', address: '', schematic_url: '', start_date: '', expected_end_date: '' })
const creating = ref(false)

// ---- 详情弹窗 ----
const detail = ref(null)
const detailData = ref(null)
const detailLoading = ref(false)

// ---- 列表 ----
async function fetchProjects() {
  loading.value = true
  try {
    const { ok, data } = await request('/api/projects')
    if (ok) projects.value = data.data || []
  } catch { /* 静默 */ }
  finally { loading.value = false }
}

// ---- 创建 ----
async function doCreate() {
  if (!createForm.value.name.trim()) return toastE('请输入工程名称')
  creating.value = true
  try {
    const { ok, data } = await request('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createForm.value),
    })
    if (!ok) { toastE(data.error || '创建失败'); return }
    toastS('工程已创建')
    showCreate.value = false
    createForm.value = { name: '', description: '', planner: '', address: '', schematic_url: '', start_date: '', expected_end_date: '' }
    fetchProjects()
  } catch (e) { toastE('创建失败：' + e.message) }
  finally { creating.value = false }
}

// ---- 详情 ----
async function openDetail(project) {
  detail.value = project
  detailLoading.value = true
  detailData.value = null
  try {
    const { ok, data } = await request(`/api/projects/${project.id}`)
    if (ok) detailData.value = data.data
  } catch { /* 静默 */ }
  finally { detailLoading.value = false }
}

// ---- 加入/离开 ----
async function doJoin() {
  const id = detailData.value?.id
  if (!id) return
  try {
    const { ok, data } = await request(`/api/projects/${id}/join`, { method: 'POST' })
    if (!ok) { toastE(data.error || '操作失败'); return }
    toastS('已加入工程')
    openDetail(detail.value) // 刷新详情
    fetchProjects()
  } catch (e) { toastE(e.message) }
}

async function doLeave() {
  const id = detailData.value?.id
  if (!id) return
  if (!confirm('确定要离开该工程吗？')) return
  try {
    const { ok, data } = await request(`/api/projects/${id}/leave`, { method: 'POST' })
    if (!ok) { toastE(data.error || '操作失败'); return }
    toastS('已离开工程')
    openDetail(detail.value)
    fetchProjects()
  } catch (e) { toastE(e.message) }
}

async function doDelete() {
  const id = detailData.value?.id
  if (!id) return
  if (!confirm('确定要删除该工程吗？此操作不可撤销。')) return
  try {
    const { ok, data } = await request(`/api/projects/${id}`, { method: 'DELETE' })
    if (!ok) { toastE(data.error || '删除失败'); return }
    toastS('工程已删除')
    detail.value = null
    fetchProjects()
  } catch (e) { toastE(e.message) }
}

// ---- 工具 ----
function statusLabel(s) {
  return { planning: '规划中', in_progress: '进行中', completed: '已完成' }[s] || s
}
function statusClass(s) {
  return { planning: 's-plan', in_progress: 's-prog', completed: 's-done' }[s] || ''
}
function isMember(d) {
  if (!userStore.user || !d?.members) return false
  return d.members.some(m => m.user_id === userStore.user.id)
}
function isLeader(d) {
  if (!userStore.user || !d?.members) return false
  return d.members.some(m => m.user_id === userStore.user.id && m.role === 'leader')
}

onMounted(fetchProjects)

// 弹窗打开时锁定 body 滚动
const modalOpen = computed(() => showCreate.value || !!detail.value)
watch(modalOpen, (v) => { document.body.style.overflow = v ? 'hidden' : '' })
onUnmounted(() => { document.body.style.overflow = '' })

</script>

<template>
  <div class="projects-page">
    <div class="page-hdr">
      <h2>生电工程</h2>
      <button v-if="userStore.isLoggedIn" class="btn-create" @click="showCreate = true">+ 创建工程</button>
    </div>

    <!-- 加载/空 -->
    <p v-if="loading" class="muted">加载中…</p>
    <p v-else-if="projects.length === 0" class="muted">暂无工程</p>

    <!-- 工程列表 -->
    <div v-else class="project-grid">
      <div v-for="p in projects" :key="p.id" class="card project-card" @click="openDetail(p)">
        <div class="pc-top">
          <h3 class="pc-name">{{ p.name }}</h3>
          <span class="pc-status" :class="statusClass(p.status)">{{ statusLabel(p.status) }}</span>
        </div>
        <div class="pc-info">
          <span v-if="p.leader_name">负责人：{{ p.leader_name }}</span>
          <span v-if="p.planner">企划：{{ p.planner }}</span>
        </div>
        <div class="pc-meta">
          <span>{{ p.member_count || 0 }} 人参与</span>
          <span v-if="p.expected_end_date">预计 {{ p.expected_end_date }}</span>
        </div>
      </div>
    </div>

    <!-- ====== 创建弹窗 ====== -->
    <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false" @touchmove.self.prevent>
      <div class="modal-card">
        <div class="modal-hdr">
          <h3>创建工程</h3>
          <button class="modal-x" @click="showCreate = false">&times;</button>
        </div>
        <form class="modal-body" @submit.prevent="doCreate">
          <label class="fld"><span>名称 *</span><input v-model="createForm.name" placeholder="工程名称" maxlength="100"></label>
          <label class="fld"><span>描述</span><textarea v-model="createForm.description" placeholder="工程描述…" rows="3" maxlength="1000"></textarea></label>
          <div class="fld-row">
            <label class="fld"><span>企划人</span><input v-model="createForm.planner" placeholder="企划人名字" maxlength="50"></label>
            <label class="fld"><span>地址</span><input v-model="createForm.address" placeholder="工程坐标/地址" maxlength="200"></label>
          </div>
          <label class="fld"><span>投影链接</span><input v-model="createForm.schematic_url" placeholder="Litematica 投影下载链接" maxlength="500"></label>
          <div class="fld-row">
            <label class="fld"><span>开始日期</span><input type="date" v-model="createForm.start_date"></label>
            <label class="fld"><span>预计完成</span><input type="date" v-model="createForm.expected_end_date"></label>
          </div>
          <button type="submit" class="btn-submit" :disabled="creating">{{ creating ? '创建中…' : '创建工程' }}</button>
        </form>
      </div>
    </div>

    <!-- ====== 详情弹窗 ====== -->
    <div v-if="detail" class="modal-overlay" @click.self="detail = null" @touchmove.self.prevent>
      <div class="modal-card detail-card">
        <div v-if="detailLoading" class="modal-body"><p class="muted">加载中…</p></div>

        <template v-else-if="detailData">
          <div class="modal-hdr">
            <div>
              <h3>{{ detailData.name }}</h3>
              <span class="pc-status" :class="statusClass(detailData.status)">{{ statusLabel(detailData.status) }}</span>
            </div>
            <button class="modal-x" @click="detail = null">&times;</button>
          </div>

          <div class="modal-body detail-body">
            <!-- 基本信息 -->
            <div v-if="detailData.description" class="detail-sec">
              <p class="detail-desc">{{ detailData.description }}</p>
            </div>

            <div class="detail-grid">
              <div class="dg-item"><span class="dg-lbl">负责人</span><span>{{ detailData.leader_name || detailData.planner || '—' }}</span></div>
              <div class="dg-item"><span class="dg-lbl">企划人</span><span>{{ detailData.planner || '—' }}</span></div>
              <div class="dg-item"><span class="dg-lbl">地址</span><span>{{ detailData.address || '—' }}</span></div>
              <div class="dg-item" v-if="detailData.schematic_url">
                <span class="dg-lbl">投影</span>
                <a :href="detailData.schematic_url" target="_blank" class="link">下载链接</a>
              </div>
              <div class="dg-item"><span class="dg-lbl">开始</span><span>{{ detailData.start_date || '—' }}</span></div>
              <div class="dg-item"><span class="dg-lbl">预计</span><span>{{ detailData.expected_end_date || '—' }}</span></div>
            </div>

            <!-- 参与成员 -->
            <div class="detail-sec">
              <h4>参与成员 ({{ detailData.members?.length || 0 }})</h4>
              <div class="member-list">
                <div v-for="m in detailData.members" :key="m.id" class="member-row">
                  <img v-if="m.qq" :src="`https://q.qlogo.cn/g?b=qq&nk=${m.qq}&s=40`" class="m-avatar">
                  <span class="m-name">{{ m.username }}</span>
                  <span class="m-role" :class="m.role === 'leader' ? 'role-lead' : ''">
                    {{ m.role === 'leader' ? '负责人' : '成员' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作栏 -->
          <div class="modal-ft">
            <div class="ft-left">
              <span class="ft-time">创建于 {{ new Date(detailData.created_at).toLocaleDateString('zh-CN') }}</span>
            </div>
            <div class="ft-actions">
              <button v-if="userStore.isLoggedIn && !isMember(detailData)" class="btn-action" @click="doJoin">加入工程</button>
              <button v-if="isMember(detailData) && !isLeader(detailData)" class="btn-action btn-warn" @click="doLeave">离开</button>
              <button v-if="isLeader(detailData)" class="btn-action btn-danger" @click="doDelete">删除工程</button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-page { max-width: 900px; }

.page-hdr {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--space-lg);
}
.page-hdr h2 { font-size: 1.3rem; font-weight: 700; }

.btn-create {
  padding: 0.5rem 1rem; background: var(--color-accent); color: var(--color-bg);
  border: none; border-radius: var(--radius-sm); font-size: 0.9rem; cursor: pointer;
  transition: background 0.15s;
}
.btn-create:hover { background: var(--color-accent-hover); }

.muted { color: var(--color-text-muted); font-size: 0.9rem; text-align: center; margin-top: var(--space-xl); }

/* ---- 卡片网格 ---- */
.project-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); }
@media (max-width: 640px) { .project-grid { grid-template-columns: 1fr; } }

.project-card { cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s; }
.project-card:hover { border-color: var(--color-border-strong); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

.pc-top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); margin-bottom: var(--space-sm); }
.pc-name { font-size: 1rem; font-weight: 600; }
.pc-status { font-size: 0.75rem; padding: 2px 8px; border-radius: 99px; font-weight: 500; }
.s-plan { background: #f0f9ff; color: #0369a1; }
.s-prog { background: #fefce8; color: #a16207; }
.s-done { background: #f0fdf4; color: #15803d; }

.pc-info { display: flex; gap: var(--space-md); font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: var(--space-xs); }
.pc-meta { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-text-muted); }

/* ---- 弹窗通用 ---- */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.45); animation: fade-in 0.2s ease;
}
.modal-card {
  background: var(--color-bg); border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); width: 90%; max-width: 560px; max-height: 85vh;
  overflow-y: auto; animation: slide-up 0.25s ease;
  scrollbar-width: none;
}
.modal-card::-webkit-scrollbar { display: none; }
.detail-card { max-width: 600px; }
.modal-hdr {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}
.modal-hdr h3 { font-size: 1.1rem; font-weight: 600; color: var(--color-text); }
.modal-x { background: none; border: none; font-size: 1.5rem; color: var(--color-text-muted); cursor: pointer; line-height: 1; }
.modal-x:hover { color: var(--color-text); }
.modal-body { padding: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-md); }
.modal-ft {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-md) var(--space-lg); border-top: 1px solid var(--color-border);
}

.fld { display: flex; flex-direction: column; gap: var(--space-xs); }
.fld span { font-size: 0.85rem; font-weight: 500; color: var(--color-text); }
.fld input, .fld textarea {
  width: 100%; padding: 0.55rem 0.7rem;
  border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  background: var(--color-bg); color: var(--color-text);
  font-size: 0.9rem; font-family: inherit;
  transition: border-color 0.15s;
}
.fld input:focus, .fld textarea:focus { outline: none; border-color: var(--color-border-strong); }
.fld input::placeholder, .fld textarea::placeholder { color: var(--color-text-muted); }
.fld textarea { resize: vertical; }
.fld-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); }

.btn-submit {
  margin-top: var(--space-sm); padding: 0.65rem; background: var(--color-accent); color: var(--color-bg);
  border: none; border-radius: var(--radius-sm); font-size: 0.95rem; cursor: pointer;
}
.btn-submit:hover { background: var(--color-accent-hover); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

/* ---- 详情 ---- */
.detail-body { gap: var(--space-lg); }
.detail-desc { font-size: 0.9rem; line-height: 1.7; color: var(--color-text-secondary); white-space: pre-line; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm); }
.dg-item { display: flex; gap: var(--space-sm); font-size: 0.9rem; }
.dg-lbl { color: var(--color-text-muted); min-width: 48px; flex-shrink: 0; }
.link { color: #2563eb; font-size: 0.9rem; }

.detail-sec { border-top: 1px solid var(--color-border); padding-top: var(--space-md); }
.detail-sec h4 { font-size: 0.9rem; font-weight: 600; margin-bottom: var(--space-sm); }

.member-list { display: flex; flex-direction: column; gap: var(--space-xs); }
.member-row { display: flex; align-items: center; gap: var(--space-sm); }
.m-avatar { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--color-border); }
.m-name { font-size: 0.9rem; }
.m-role { font-size: 0.75rem; padding: 1px 6px; border-radius: 99px; background: var(--color-bg-secondary); color: var(--color-text-muted); }
.m-role.role-lead { background: #fef3c7; color: #92400e; }

.ft-time { font-size: 0.8rem; color: var(--color-text-muted); }
.ft-actions { display: flex; gap: var(--space-sm); }

.btn-action {
  padding: 0.4rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  background: var(--color-bg); color: var(--color-text); font-size: 0.85rem; cursor: pointer;
  transition: all 0.15s;
}
.btn-action:hover { background: var(--color-bg-secondary); }
.btn-warn:hover { border-color: #f59e0b; color: #b45309; background: #fffbeb; }
.btn-danger:hover { border-color: #ef4444; color: #dc2626; background: #fef2f2; }

@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
