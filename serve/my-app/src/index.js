import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())

// 初始化数据库表
app.on('GET', '/api/init', async (c) => {
  try {
    // 创建注册码表
    await c.env.db.prepare(`
      CREATE TABLE IF NOT EXISTS registerCodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        is_used INTEGER DEFAULT 0
      )
    `).run()

    // 创建用户表
    await c.env.db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        qq TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    // 创建邮箱验证码表
    await c.env.db.prepare(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        email TEXT PRIMARY KEY,
        code TEXT NOT NULL,
        qq TEXT NOT NULL,
        otp_code TEXT NOT NULL,
        expires_at DATETIME NOT NULL
      )
    `).run()

    // 插入测试注册码
    await c.env.db.prepare(
      `INSERT OR IGNORE INTO registerCodes (code, expires_at, is_used) VALUES (?, ?, ?)`
    ).bind('1', '2099-12-31T23:59:59.000Z', 0).run()

    return c.json({ success: true, message: '数据库初始化成功' })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 验证注册码
app.post('/api/validateRegisterCode', async (c) => {
  try {
    const { registerCode } = await c.req.json()
    const now = new Date().toISOString()
    const codeRecord = await c.env.db.prepare(
      'SELECT * FROM registerCodes WHERE code = ? AND is_used = 0 AND expires_at > ?'
    ).bind(registerCode, now).first()

    if (codeRecord) {
      return c.json({ valid: true, code: codeRecord.code })
    } else {
      return c.json({ valid: false })
    }
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 发送邮箱验证码
// 注意：Cloudflare Workers 不支持 nodemailer
// 可以使用 Mailchannels (免费) 或其他邮件 API
app.post('/api/send-otp', async (c) => {
  try {
    const { email, code, qq } = await c.req.json()
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 10)

    // 存储验证信息
    await c.env.db.prepare(`
      INSERT OR REPLACE INTO email_verifications (email, code, qq, otp_code, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(email, code, qq, otp, expires.toISOString()).run()

    // 使用 Mailchannels 发送邮件 (免费，无需注册)
    // 注意：需要在 Cloudflare Workers 中配置
    try {
      await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: email }],
              subject: '糖豆方块屋 - 注册验证码',
            },
          ],
          from: {
            email: c.env.EMAIL_USER,
            name: '糖豆方块屋',
          },
          content: [
            {
              type: 'text/plain',
              value: `您的验证码是 ${otp}，10分钟内有效。`,
            },
            {
              type: 'text/html',
              value: `<p>您的验证码是 <b>${otp}</b>，10分钟内有效。</p>`,
            },
          ],
        }),
      })
      return c.json({ success: true, message: '邮件已发送' })
    } catch (emailError) {
      console.error('邮件发送失败:', emailError)
      // 开发环境返回验证码（测试用）
      return c.json({ success: true, message: `邮件已发送（开发环境验证码：${otp}）` })
    }
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 检验验证码并注册
app.post('/api/check-otp', async (c) => {
  try {
    const { code, email, otp, password, username, qq } = await c.req.json()
    const now = new Date().toISOString()

    const opt_code = await c.env.db.prepare(
      'SELECT * FROM email_verifications WHERE email = ? AND code = ? AND qq = ? AND otp_code = ? AND expires_at > ?'
    ).bind(email, code, qq, otp, now).first()

    if (opt_code) {
      const result = await c.env.db.prepare(
        'INSERT INTO users (username, qq, password, email) VALUES (?, ?, ?, ?)'
      ).bind(username, qq, password, email).run()

      // 标记注册码为已使用
      await c.env.db.prepare('UPDATE registerCodes SET is_used = 1 WHERE code = ?').bind(code).run()

      const user = await c.env.db.prepare('SELECT * FROM users WHERE id = ?').bind(result.meta.last_row_id).first()

      return c.json({
        valid: true,
        user: { id: user.id, username: user.username, email: user.email, qq: user.qq },
      })
    } else {
      return c.json({ valid: false })
    }
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 登录
app.post('/api/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    const user = await c.env.db.prepare('SELECT * FROM users WHERE username = ?').bind(username).first()

    if (user && user.password === password) {
      return c.json({
        success: true,
        user: { id: user.id, username: user.username, email: user.email, qq: user.qq },
      })
    } else {
      return c.json({ success: false, error: '用户名或密码错误' })
    }
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 健康检查
app.get('/', (c) => c.json({ status: 'ok', message: '糖豆方块屋 API' }))

export default app
