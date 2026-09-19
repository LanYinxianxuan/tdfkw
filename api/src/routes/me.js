import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth.js'
import { success, error } from '../utils/response.js'

const me = new Hono()

me.get('/me', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId')
    const user = await c.env.db
      .prepare('SELECT id, username, email, qq FROM users WHERE id = ?')
      .bind(userId)
      .first()

    if (!user) {
      return error(c, '用户不存在', 404)
    }

    return success(c, { user })
  } catch (e) {
    return error(c, e.message, 500)
  }
})

export default me
