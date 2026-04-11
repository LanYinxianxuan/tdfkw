import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const users = []
const whitelist = []
const emailCodes = new Map()
const registrationOpen = true

const createCode = () => Math.floor(100000 + Math.random() * 900000).toString()

app.get('/api/status', (req, res) => {
  res.json({
    ok: true,
    registrationOpen,
    message: '后端已启动，接口可用。',
  })
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ ok: false, message: '用户名和密码不能为空。' })
  }

  const user = users.find(u => u.username === username && u.password === password)
  if (!user) {
    return res.status(401).json({ ok: false, message: '用户名或密码错误。' })
  }

  res.json({
    ok: true,
    message: '登录成功。',
    user: { username: user.username, email: user.email },
  })
})

app.post('/api/send-code', (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ ok: false, message: '邮箱不能为空。' })
  }

  const code = createCode()
  emailCodes.set(email, code)

  console.log(`验证码发送到 ${email}: ${code}`)

  res.json({ ok: true, message: '验证码已发送。请查看后台日志。', code })
})

app.post('/api/register', (req, res) => {
  const { username, email, password, code } = req.body
  if (!username || !email || !password || !code) {
    return res.status(400).json({ ok: false, message: '用户名、邮箱、密码和验证码都是必填项。' })
  }

  const expectedCode = emailCodes.get(email)
  if (!expectedCode || expectedCode !== code) {
    return res.status(400).json({ ok: false, message: '验证码无效或已过期。' })
  }

  if (users.some(u => u.username === username || u.email === email)) {
    return res.status(409).json({ ok: false, message: '用户名或邮箱已存在。' })
  }

  users.push({ username, email, password })
  emailCodes.delete(email)

  res.json({ ok: true, message: '注册成功。' })
})

app.post('/api/whitelist', (req, res) => {
  const { username, email } = req.body
  if (!username || !email) {
    return res.status(400).json({ ok: false, message: '用户名和邮箱不能为空。' })
  }

  if (whitelist.some(item => item.username === username || item.email === email)) {
    return res.status(409).json({ ok: false, message: '该用户或邮箱已在白名单中。' })
  }

  whitelist.push({ username, email, addedAt: new Date().toISOString() })
  res.json({ ok: true, message: '白名单申请已提交。' })
})

app.get('/api/whitelist', (req, res) => {
  res.json({ ok: true, whitelist })
})

app.listen(PORT, () => {
  console.log(`tdfkw 后端服务启动成功：http://localhost:${PORT}`)
})
