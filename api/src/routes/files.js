import { Hono } from 'hono'
import { fileUploadSchema, validate } from '../validation.js'
import { authMiddleware } from '../middleware/auth.js'
import { success, error } from '../utils/response.js'

const files = new Hono()

// 最大文件大小：5MB（解码后）
const MAX_FILE_SIZE = 5 * 1024 * 1024

// 跨平台 base64 → Uint8Array（兼容 Node.js 和 Cloudflare Workers）
function base64ToBytes(base64) {
  const binaryStr = atob(base64)
  const bytes = new Uint8Array(binaryStr.length)
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }
  return bytes
}

// GET /api/files — 获取所有档案列表（公开）
files.get('/files', async (c) => {
  try {
    const { results } = await c.env.db
      .prepare(
        'SELECT id, name, author, introduction, filename, mime_type, size, uploader_id, created_at FROM files ORDER BY created_at DESC',
      )
      .all()

    return success(c, results)
  } catch (e) {
    return error(c, e.message, 500)
  }
})

// GET /api/files/:id — 获取单个档案详情（含文件数据用于下载）
files.get('/files/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const row = await c.env.db
      .prepare('SELECT * FROM files WHERE id = ?')
      .bind(id)
      .first()

    if (!row) {
      return error(c, '档案不存在', 404)
    }

    // 返回 data 字段用于下载（转为 base64）
    return success(c, {
      id: row.id,
      name: row.name,
      author: row.author,
      introduction: row.introduction,
      filename: row.filename,
      mimeType: row.mime_type,
      size: row.size,
      data: row.data || null,
      uploaderId: row.uploader_id,
      createdAt: row.created_at,
    })
  } catch (e) {
    return error(c, e.message, 500)
  }
})

// POST /api/files — 上传档案（需登录）
files.post('/files', authMiddleware, async (c) => {
  try {
    const body = await c.req.json()
    const err = validate(fileUploadSchema, body, c)
    if (err) return err

    const { name, author, introduction, filename, mimeType, data } = body

    // 解码 base64
    const bytes = base64ToBytes(data)

    if (bytes.length > MAX_FILE_SIZE) {
      return error(c, `文件大小不能超过 ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    const uploaderId = c.get('userId')

    const result = await c.env.db
      .prepare(
        'INSERT INTO files (name, author, introduction, filename, mime_type, size, data, uploader_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .bind(name, author, introduction || '', filename, mimeType, bytes.length, bytes, uploaderId)
      .run()

    const created = await c.env.db
      .prepare('SELECT id, name, author, introduction, filename, mime_type, size, uploader_id, created_at FROM files WHERE id = ?')
      .bind(result.meta.last_row_id)
      .first()

    return success(c, created, 201)
  } catch (e) {
    return error(c, e.message, 500)
  }
})

// DELETE /api/files/:id — 删除档案（需登录，仅上传者本人可删）
files.delete('/files/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id')
    const userId = c.get('userId')

    const row = await c.env.db
      .prepare('SELECT * FROM files WHERE id = ?')
      .bind(id)
      .first()

    if (!row) {
      return error(c, '档案不存在', 404)
    }

    if (row.uploader_id !== userId) {
      return error(c, '只能删除自己上传的档案', 403)
    }

    await c.env.db.prepare('DELETE FROM files WHERE id = ?').bind(id).run()

    return success(c, { id: Number(id) })
  } catch (e) {
    return error(c, e.message, 500)
  }
})

export default files
