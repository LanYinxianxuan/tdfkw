import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth.js'
import { success, error } from '../utils/response.js'

const projects = new Hono()

// GET /api/projects — 工程列表（公开）
projects.get('/projects', async (c) => {
  try {
    const { results } = await c.env.db
      .prepare(`
        SELECT p.*, u.username AS leader_name, cu.username AS creator_name,
          (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) AS member_count
        FROM projects p
        LEFT JOIN users u ON p.leader_id = u.id
        LEFT JOIN users cu ON p.creator_id = cu.id
        ORDER BY p.created_at DESC
      `)
      .all()
    return success(c, results)
  } catch (e) {
    return error(c, e.message, 500)
  }
})

// GET /api/projects/:id — 工程详情（含成员列表）
projects.get('/projects/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const project = await c.env.db
      .prepare(`
        SELECT p.*, u.username AS leader_name, cu.username AS creator_name
        FROM projects p
        LEFT JOIN users u ON p.leader_id = u.id
        LEFT JOIN users cu ON p.creator_id = cu.id
        WHERE p.id = ?
      `)
      .bind(id)
      .first()

    if (!project) return error(c, '工程不存在', 404)

    const { results: members } = await c.env.db
      .prepare(`
        SELECT pm.*, u.username, u.qq
        FROM project_members pm
        JOIN users u ON pm.user_id = u.id
        WHERE pm.project_id = ?
        ORDER BY pm.joined_at ASC
      `)
      .bind(id)
      .all()

    return success(c, { ...project, members })
  } catch (e) {
    return error(c, e.message, 500)
  }
})

// POST /api/projects — 创建工程（需登录）
projects.post('/projects', authMiddleware, async (c) => {
  try {
    const body = await c.req.json()
    const { name, description, planner, address, schematic_url, start_date, expected_end_date } = body

    if (!name || !name.trim()) return error(c, '工程名称不能为空')

    const userId = c.get('userId')

    const result = await c.env.db
      .prepare(`
        INSERT INTO projects (name, description, leader_id, planner, address, schematic_url, start_date, expected_end_date, creator_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        name.trim(), description || '', userId, planner || '', address || '',
        schematic_url || '', start_date || null, expected_end_date || null, userId,
      )
      .run()

    // 创建者自动加入为 leader
    await c.env.db
      .prepare('INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)')
      .bind(result.meta.last_row_id, userId, 'leader')
      .run()

    const created = await c.env.db
      .prepare('SELECT * FROM projects WHERE id = ?').bind(result.meta.last_row_id).first()

    return success(c, created, 201)
  } catch (e) {
    return error(c, e.message, 500)
  }
})

// POST /api/projects/:id/join — 加入工程（需登录）
projects.post('/projects/:id/join', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id')
    const userId = c.get('userId')

    const project = await c.env.db.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first()
    if (!project) return error(c, '工程不存在', 404)

    // 检查是否已加入
    const existing = await c.env.db
      .prepare('SELECT * FROM project_members WHERE project_id = ? AND user_id = ?')
      .bind(id, userId)
      .first()

    if (existing) return error(c, '你已加入该工程')

    await c.env.db
      .prepare('INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)')
      .bind(id, userId, 'member')
      .run()

    return success(c, { joined: true })
  } catch (e) {
    return error(c, e.message, 500)
  }
})

// POST /api/projects/:id/leave — 离开工程（需登录）
projects.post('/projects/:id/leave', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id')
    const userId = c.get('userId')

    const membership = await c.env.db
      .prepare('SELECT * FROM project_members WHERE project_id = ? AND user_id = ?')
      .bind(id, userId)
      .first()

    if (!membership) return error(c, '你未加入该工程')

    // 负责人不能离开，除非先转让
    if (membership.role === 'leader') return error(c, '负责人不能离开工程，请先转让负责人')

    await c.env.db
      .prepare('DELETE FROM project_members WHERE project_id = ? AND user_id = ?')
      .bind(id, userId)
      .run()

    return success(c, { left: true })
  } catch (e) {
    return error(c, e.message, 500)
  }
})

// DELETE /api/projects/:id — 删除工程（需登录，仅创建者或负责人）
projects.delete('/projects/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id')
    const userId = c.get('userId')

    const project = await c.env.db.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first()
    if (!project) return error(c, '工程不存在', 404)

    if (project.creator_id !== userId && project.leader_id !== userId) {
      return error(c, '只有创建者或负责人可以删除工程', 403)
    }

    await c.env.db.prepare('DELETE FROM projects WHERE id = ?').bind(id).run()
    return success(c, { deleted: true })
  } catch (e) {
    return error(c, e.message, 500)
  }
})

export default projects
