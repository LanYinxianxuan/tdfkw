<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request.js'
import { useToast } from '@/utils/toast.js'
import { useUserStore } from '@/stores/user.js'
import UploadModal from '@/components/UploadModal.vue'

const userStore = useUserStore()
const { success: toastSuccess, error: toastError } = useToast()

const files = ref([])
const searchQuery = ref('')
const loading = ref(false)
const showUploadModal = ref(false)

async function fetchFiles() {
  loading.value = true
  try {
    const { ok, data } = await request('/api/files')
    if (ok) {
      files.value = data.data || []
    }
  } catch {
    // 静默处理
  } finally {
    loading.value = false
  }
}

function search() {
  // 本地过滤：名称或作者匹配
  if (!searchQuery.value.trim()) {
    fetchFiles()
    return
  }
  const q = searchQuery.value.trim().toLowerCase()
  files.value = files.value.filter(
    (f) => f.name.toLowerCase().includes(q) || f.author.toLowerCase().includes(q),
  )
}

function handleUploaded() {
  fetchFiles()
}

async function downloadFile(file) {
  try {
    const { ok, data } = await request(`/api/files/${file.id}`)
    if (!ok || !data.data?.data) {
      toastError('下载失败')
      return
    }

    // 构造下载链接
    const byteChars = atob(data.data.data)
    const byteNums = new Array(byteChars.length)
    for (let i = 0; i < byteChars.length; i++) {
      byteNums[i] = byteChars.charCodeAt(i)
    }
    const byteArr = new Uint8Array(byteNums)
    const blob = new Blob([byteArr], { type: data.data.mimeType || 'application/octet-stream' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = data.data.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (e) {
    toastError('下载失败：' + e.message)
  }
}

async function deleteFile(file) {
  if (!confirm(`确定要删除 "${file.name}" 吗？`)) return

  try {
    const { ok, data } = await request(`/api/files/${file.id}`, { method: 'DELETE' })
    if (!ok) {
      toastError(data.error || '删除失败')
      return
    }
    toastSuccess('删除成功')
    fetchFiles()
  } catch (e) {
    toastError('删除失败：' + e.message)
  }
}

onMounted(() => {
  fetchFiles()
})
</script>

<template>
  <div class="files-page">
    <div class="search-card">
      <input
        class="search-box"
        v-model="searchQuery"
        type="text"
        placeholder="搜索名称或作者"
        @keyup.enter="search"
      />
      <input class="btn-search" type="button" value="搜索" @click="search" />
      <input
        v-if="userStore.isLoggedIn"
        class="btn-upload"
        type="button"
        value="上传"
        @click="showUploadModal = true"
      />
    </div>

    <!-- 加载状态 -->
    <p v-if="loading" class="status-text">加载中…</p>
    <p v-else-if="files.length === 0" class="status-text">暂无档案</p>

    <div class="information" v-else>
      <div class="information-card card" v-for="file in files" :key="file.id">
        <div class="card-img">
          <div class="file-icon">
            <span class="file-ext">{{ (file.filename || '').split('.').pop()?.toUpperCase() || '?' }}</span>
          </div>
        </div>
        <div class="card-content">
          <div class="content-top">
            <div class="content-title">
              <a href="#" @click.prevent="downloadFile(file)">{{ file.name }}</a>
            </div>
            <div class="content-author">By {{ file.author }}</div>
          </div>
          <div class="content-bottom">
            <p v-if="file.introduction">{{ file.introduction }}</p>
            <p v-else class="no-intro">暂无介绍</p>
            <div class="file-meta">
              <span class="meta-size">{{ (file.size / 1024).toFixed(1) }} KB</span>
              <span class="meta-date">{{ new Date(file.created_at).toLocaleDateString('zh-CN') }}</span>
            </div>
          </div>
          <div class="content-actions">
            <button class="btn-action" @click="downloadFile(file)">下载</button>
            <button
              v-if="userStore.user && userStore.user.id === file.uploader_id"
              class="btn-action btn-danger"
              @click="deleteFile(file)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传弹窗 -->
    <UploadModal
      v-if="showUploadModal"
      @close="showUploadModal = false"
      @uploaded="handleUploaded"
    />
  </div>
</template>

<style scoped>
.files-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.search-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.search-box {
  width: 100%;
}

.btn-search,
.btn-upload {
  margin-left: var(--space-sm);
  border-radius: var(--radius-sm);
  border: solid var(--color-border) 1px;
  padding: var(--space-sm);
  background-color: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-search:hover,
.btn-upload:hover {
  background: var(--color-bg-secondary);
}

.status-text {
  margin-top: var(--space-xl);
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.information {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--space-md);
  gap: var(--space-sm);
}

.information-card {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  padding: var(--space-md);
  gap: var(--space-md);
}

.card-img {
  flex-shrink: 0;
  width: 72px;
}

.file-icon {
  width: 72px;
  height: 72px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-ext {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  letter-spacing: 0.5px;
}

.card-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
}

.content-top {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: baseline;
}

.content-title a {
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text);
  cursor: pointer;
  transition: color 0.15s;
}

.content-title a:hover {
  color: var(--color-text-secondary);
}

.content-author {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.content-bottom {
  margin-top: var(--space-xs);
}

.content-bottom p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.no-intro {
  color: var(--color-text-muted) !important;
  font-style: italic;
}

.file-meta {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-xs);
}

.meta-size,
.meta-date {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.content-actions {
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.btn-action {
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-action:hover {
  background: var(--color-bg-secondary);
}

.btn-danger:hover {
  background: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}
</style>
