import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Database from 'better-sqlite3'
import nodemailer from 'nodemailer'
const app = new Hono()
app.use('/*', cors())
const db = new Database('data.db')
// 注册码表
db.exec(`
  -- 注册码表：存储预生成的注册码及其状态
  CREATE TABLE IF NOT EXISTS registerCodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,      -- 注册码内容
  expires_at DATETIME NOT NULL,   -- 过期时间
  is_used INTEGER DEFAULT 0       -- 是否已被使用 (0: 否, 1: 是)
  );

  -- 用户表：存储注册成功的用户信息
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,  -- 用户名
    qq TEXT UNIQUE NOT NULL,        -- QQ
    password TEXT NOT NULL,         -- 密码
    email TEXT UNIQUE,              -- 绑定邮箱
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 邮箱验证码表：存储临时发送的 OTP
  CREATE TABLE IF NOT EXISTS email_verifications (
    email TEXT PRIMARY KEY,         -- 以邮箱为主键
    code TEXT NOT NULL,          -- 注册码内容
    otp_code TEXT NOT NULL,         -- 6位验证码
    expires_at DATETIME NOT NULL    -- 验证码过期时间
  );
`)
// 测试用
db.prepare('INSERT OR IGNORE INTO registerCodes (code, expires_at, is_used) VALUES (?, ?, ?)').run(
  '1',
  '2099-12-31T23:59:59.000Z',
  0
)
const validateRegisterCodeStmt = db.prepare(
  'SELECT * FROM registerCodes WHERE code  = ? AND is_used = 0 AND expires_at > ?'
)
app.post('/api/validateRegisterCode', async c => {
  const { registerCode } = await c.req.json()
  const now = new Date().toISOString()
  const codeRecord = validateRegisterCodeStmt.get(registerCode, now)
  // console.log('验证注册码:', registerCode, '结果:', codeRecord.code)
  if (codeRecord) {
    return c.json({ valid: true, code: codeRecord.code })
  } else {
    return c.json({ valid: false })
  }
})
// 1. 创建 163 邮箱发信器
const transporter = nodemailer.createTransport({
  host: 'smtp.163.com', // 163 的服务器地址
  port: 465, // 必须使用 465 端口
  secure: true, // 必须为 true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // 步骤 A 获取的授权码
  },
})

// 接收数据
app.post('/api/send-otp', async c => {
  try {
    const { email, code } = await c.req.json()
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 10)

    // 存储依据
    db.prepare(
      `
      INSERT OR REPLACE INTO email_verifications (email, code, otp_code, expires_at) 
      VALUES (?, ?, ?, ?)
    `
    ).run(email, code, otp, expires.toISOString())

    // 发送动作
    await transporter.sendMail({
      from: `"我的应用" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '注册码校验',
      text: `您的验证码是 ${otp}，10分钟内有效。`,
      html: `<p>您的验证码是 <b>${otp}</b>，10分钟内有效。</p>`,
    })

    return c.json({ success: true, message: '邮件已发送' })
  } catch (error) {
    console.error('163 发信失败:', error)
    return c.json({ success: false, error: '请检查 163 授权码或网络' }, 500)
  }
})

// 检验验证码
app.post('/api/check-otp', async c => {
  try {
    const { code, email, otp, password, username, qq } = await c.req.json()
    const now = new Date().toISOString()
    const opt_code = db
      .prepare(
        'SELECT * FROM email_verifications WHERE email = ? AND code = ? AND otp_code = ? AND expires_at > ?'
      )
      .get(email, code, otp, now)
      console.log(opt_code)
    if (opt_code) {
      const info = db.prepare('INSERT INTO users (username, qq, password, email) VALUES (?, ?, ?, ?)').run(
        username,
        qq,
        password,
        email
      )
      const userid = info.lastInsertRowid
      console.log(userid)
      return c.json({ valid: true, userid: userid.value })
    } else {
      return c.json({ valid: false })
    }
  } catch (error) {
    console.error('验证码校验失败:', error)
    return c.json({ success: false, error: '服务器错误' }, 500)
  }
})

serve(app)
