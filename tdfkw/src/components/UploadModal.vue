<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { request } from '@/utils/request.js'
import { useToast } from '@/utils/toast.js'

const emit = defineEmits(['close', 'uploaded'])

// 弹窗打开时锁定 body 滚动，关闭时恢复
onMounted(() => {
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  document.body.style.overflow = ''
})

const { success: toastSuccess, error: toastError } = useToast()

const form = ref({
  name: '',
  author: '',
  introduction: '',
})

const selectedFile = ref(null)
const uploading = ref(false)

function onFileChange(e) {
  const f = e.target.files?.[0]
  if (!f) {
    selectedFile.value = null
    return
  }
  // 限制 5MB
  if (f.size > 5 * 1024 * 1024) {
    toastError('文件大小不能超过 5MB')
    e.target.value = ''
    selectedFile.value = null
    return
  }
  selectedFile.value = f
  // 自动以文件名填充名称
  if (!form.value.name) {
    form.value.name = f.name.replace(/\.[^/.]+$/, '')
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // data:xxx;base64,xxxx → 只要 base64 部分
      const result = reader.result
      const commaIdx = result.indexOf(',')
      resolve(result.slice(commaIdx + 1))
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsDataURL(file)
  })
}

async function submit() {
  if (!form.value.name.trim()) return toastError('请输入名称')
  if (!form.value.author.trim()) return toastError('请输入作者')
  if (!selectedFile.value) return toastError('请选择文件')

  uploading.value = true
  try {
    const base64Data = await readFileAsBase64(selectedFile.value)
    const { ok, data } = await request('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.value.name.trim(),
        author: form.value.author.trim(),
        introduction: form.value.introduction.trim(),
        filename: selectedFile.value.name,
        mimeType: selectedFile.value.type || 'application/octet-stream',
        data: base64Data,
      }),
    })

    if (!ok) {
      toastError(data.error || '上传失败')
      return
    }

    toastSuccess('上传成功')
    emit('uploaded', data.data)
    emit('close')
  } catch (e) {
    toastError('上传失败：' + e.message)
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')" @touchmove.self.prevent>
    <div class="modal-card">
      <div class="modal-header">
        <h3>上传档案</h3>
        <button class="modal-close" @click="emit('close')">&times;</button>
      </div>

      <form class="modal-body" @submit.prevent="submit">
        <label class="field">
          <span class="field-label">名称</span>
          <input
            v-model="form.name"
            type="text"
            placeholder="档案名称"
            maxlength="100"
          />
        </label>

        <label class="field">
          <span class="field-label">作者</span>
          <input
            v-model="form.author"
            type="text"
            placeholder="作者名"
            maxlength="50"
          />
        </label>

        <label class="field">
          <span class="field-label">介绍</span>
          <textarea
            v-model="form.introduction"
            placeholder="简单介绍一下这个档案…"
            maxlength="500"
            rows="3"
          ></textarea>
        </label>

        <label class="field">
          <span class="field-label">文件</span>
          <div class="file-input-wrap">
            <input
              type="file"
              class="file-input"
              @change="onFileChange"
            />
            <span v-if="selectedFile" class="file-name">
              {{ selectedFile.name }} ({{ (selectedFile.size / 1024).toFixed(1) }} KB)
            </span>
            <span v-else class="file-placeholder">选择要上传的文件（≤ 5MB）</span>
          </div>
        </label>

        <button type="submit" class="btn-submit" :disabled="uploading">
          {{ uploading ? '上传中…' : '上传' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  animation: fade-in 0.2s ease;
}

.modal-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slide-up 0.25s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-muted);
  cursor: pointer;
  line-height: 1;
  padding: 0 var(--space-xs);
  transition: color 0.15s;
}

.modal-close:hover {
  color: var(--color-text);
}

.modal-body {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.field-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
}

textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

textarea:focus {
  outline: none;
  border-color: var(--color-border-strong);
}

textarea::placeholder {
  color: var(--color-text-muted);
}

.file-input-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  overflow: hidden;
}

.file-input {
  max-width: 120px;
  padding: 0;
  border: none !important;
  font-size: 0.85rem;
}

.file-input::file-selector-button {
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s;
}

.file-input::file-selector-button:hover {
  background: var(--color-bg-secondary);
}

.file-name {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-placeholder {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.btn-submit {
  margin-top: var(--space-sm);
  padding: 0.65rem 1.2rem;
  background: var(--color-accent);
  color: var(--color-bg);
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-submit:hover {
  background: var(--color-accent-hover);
}

.btn-submit:active {
  transform: scale(0.98);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
