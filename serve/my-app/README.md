# 糖豆方块屋 API - Cloudflare Workers

基于 Hono + Cloudflare D1 的后端 API 服务。

## 从 Node.js 迁移到 Cloudflare Workers

### 主要差异

| Node.js | Cloudflare Workers |
|---------|-------------------|
| `better-sqlite3` | D1 Database |
| `nodemailer` | Mailchannels / fetch |
| `process.env` | `c.env` |
| `new Database('data.db')` | `c.env.db.prepare()` |
| `serve(app)` | `export default app` |

### 快速开始

#### 1. 安装依赖
```bash
npm install
```

#### 2. 创建 D1 数据库
```bash
npm run d1:create
```
复制返回的 `database_id` 到 `wrangler.toml` 中的 `database_id`。

#### 3. 初始化数据库表
```bash
npm run d1:execute
```

#### 4. 本地开发
```bash
npm run dev
```
访问 `http://localhost:8787`

#### 5. 部署
```bash
npm run deploy
```

### 配置说明

#### wrangler.toml
```toml
name = "tdfkw-api"
main = "src/index.js"
compatibility_date = "2024-04-01"

[[d1_databases]]
binding = "db"
database_name = "tdfkw-db"
database_id = "your-database-id"  # 替换为你的 ID

[vars]
EMAIL_USER = "your-email@163.com"
```

#### 环境变量
- `db`: D1 数据库绑定
- `EMAIL_USER`: 发件邮箱地址

### API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/init` | 初始化数据库表 |
| POST | `/api/validateRegisterCode` | 验证注册码 |
| POST | `/api/send-otp` | 发送邮箱验证码 |
| POST | `/api/check-otp` | 验证码校验并注册 |
| POST | `/api/login` | 用户登录 |
| GET | `/` | 健康检查 |

### D1 数据库操作

#### 查询单条
```js
const user = await c.env.db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first()
```

#### 查询多条
```js
const users = await c.env.db.prepare('SELECT * FROM users').all()
```

#### 插入数据
```js
const result = await c.env.db.prepare('INSERT INTO users (name) VALUES (?)').bind(name).run()
const lastId = result.meta.last_row_id
```

#### 更新数据
```js
await c.env.db.prepare('UPDATE users SET name = ? WHERE id = ?').bind(name, id).run()
```

### 邮件发送

使用 Mailchannels（免费，无需注册）：

```js
await fetch('https://api.mailchannels.net/tx/v1/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    personalizations: [{ to: [{ email: 'to@example.com' }] }],
    from: { email: 'from@example.com', name: 'Sender' },
    content: [{ type: 'text/plain', value: 'Hello' }]
  })
})
```

### 常用命令

```bash
# 查询数据库
npm run d1:query -- "SELECT * FROM users"

# 自定义 SQL
npm run d1:query --command "SELECT COUNT(*) FROM users"

# 查看日志
wrangler tail
```

### 注意事项

1. **数据库绑定**: 使用 `c.env.db` 访问 D1
2. **环境变量**: 使用 `c.env.VAR_NAME` 访问
3. **异步操作**: D1 所有操作都是异步的，需要 `await`
4. **邮件发送**: Workers 不支持 SMTP，使用 HTTP API
