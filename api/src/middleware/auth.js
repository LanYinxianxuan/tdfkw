import { verifyToken } from '../utils/jwt.js'

export async function authMiddleware(c, next) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: '未登录' }, 401)
  }

  const token = authHeader.slice(7)
  const payload = await verifyToken(c, token)
  if (!payload) {
    return c.json({ success: false, error: '登录已过期，请重新登录' }, 401)
  }

  c.set('userId', payload.userId)
  c.set('username', payload.username)
  await next()
}
