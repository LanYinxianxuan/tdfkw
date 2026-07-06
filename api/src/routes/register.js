import { Hono } from 'hono'
import { registerCodeSchema, sendOtpSchema, checkOtpSchema, validate } from '../validation.js'
import bcryptjs from 'bcryptjs'
import { getResend } from '../utils/resend.js'
import { signToken } from '../utils/jwt.js'
import { success, error } from '../utils/response.js'

const register = new Hono()

register.post('/validateRegisterCode', async (c) => {
  try {
    const body = await c.req.json()
    const err = validate(registerCodeSchema, body, c)
    if (err) return err

    const { registerCode } = body
    const now = new Date().toISOString()
    const codeRecord = await c.env.db
      .prepare(
        registerCode === '1'
          ? 'SELECT * FROM registerCodes WHERE code = ? AND expires_at > ?'
          : 'SELECT * FROM registerCodes WHERE code = ? AND is_used = 0 AND expires_at > ?',
      )
      .bind(registerCode, now)
      .first()

    if (!codeRecord) {
      return error(c, '注册码无效或已过期')
    }
    return success(c, { code: codeRecord.code })
  } catch (e) {
    return error(c, e.message, 500)
  }
})

register.post('/send-otp', async (c) => {
  try {
    const body = await c.req.json()
    const err = validate(sendOtpSchema, body, c)
    if (err) return err

    const { email, code } = body

    // 限流：检查是否已有未过期的验证码（60秒内）
    const recentOtp = await c.env.db
      .prepare(
        `SELECT expires_at FROM email_verifications
         WHERE email = ? AND datetime(expires_at, '-9 minutes') > datetime('now')
         LIMIT 1`,
      )
      .bind(email)
      .first()

    if (recentOtp) {
      return error(c, '发送过于频繁，请60秒后再试', 429)
    }

    // 限流：每小时最多5次
    const hourCount = await c.env.db
      .prepare(
        `SELECT COUNT(*) as count FROM email_verifications
         WHERE email = ? AND datetime(created_at, '+1 hour') > datetime('now')`,
      )
      .bind(email)
      .first()

    if (hourCount && hourCount.count >= 5) {
      return error(c, '发送次数过多，请1小时后再试', 429)
    }

    const otp = Math.floor(100000 + Math.random() * 900000)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString()
    const createdAt = now.toISOString()

    await c.env.db
      .prepare(
        'INSERT OR REPLACE INTO email_verifications (email, code, otp_code, expires_at, created_at) VALUES (?, ?, ?, ?, ?)',
      )
      .bind(email, code, String(otp), expiresAt, createdAt)
      .run()

    const resend = getResend(c)
    const { data, error: resendError } = await resend.emails.send({
      from: 'TDFKW 注册 <auth@tangdoufangkuaiwu.top>',
      to: [email],
      template: {
        id: 'otp',
        variables: { otp },
      },
    })

    if (resendError) {
      return error(c, '邮件发送失败', 500)
    }

    return success(c, { id: data?.id })
  } catch (e) {
    return error(c, e.message, 500)
  }
})

register.post('/check-otp', async (c) => {
  try {
    const body = await c.req.json()
    const err = validate(checkOtpSchema, body, c)
    if (err) return err

    const { code, email, otp, password, username, qq } = body
    const now = new Date().toISOString()

    const optCode = await c.env.db
      .prepare(
        'SELECT * FROM email_verifications WHERE email = ? AND code = ? AND otp_code = ? AND expires_at > ?',
      )
      .bind(email, code, String(otp), now)
      .first()

    if (!optCode) {
      return error(c, '验证码错误或已过期')
    }

    const hashedPassword = await bcryptjs.hash(password, 10)

    const result = await c.env.db
      .prepare('INSERT INTO users (username, qq, password, email) VALUES (?, ?, ?, ?)')
      .bind(username, qq, hashedPassword, email)
      .run()

    if (code !== '1') {
      await c.env.db
        .prepare('UPDATE registerCodes SET is_used = 1 WHERE code = ?')
        .bind(code)
        .run()
    }

    const user = await c.env.db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(result.meta.last_row_id)
      .first()

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

export default register
