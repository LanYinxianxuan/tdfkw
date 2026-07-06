import { Hono } from 'hono'
import { loginSchema, validate } from '../validation.js'
import bcryptjs from 'bcryptjs'
import { signToken } from '../utils/jwt.js'
import { success, error } from '../utils/response.js'

const auth = new Hono()

auth.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const err = validate(loginSchema, body, c)
    if (err) return err

    const { username, password } = body
    const user = await c.env.db
      .prepare('SELECT * FROM users WHERE username = ?')
      .bind(username)
      .first()

    if (!user) {
      return error(c, '用户名或密码错误')
    }

    const passwordValid = await bcryptjs.compare(password, user.password)
    if (!passwordValid) {
      return error(c, '用户名或密码错误')
    }

    return success(c, {
      token: await signToken(c, { userId: user.id, username: user.username }),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        qq: user.qq,
      },
    })
  } catch (e) {
    return error(c, e.message, 500)
  }
})

export default auth
