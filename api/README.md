# 糖豆方块屋 API - Cloudflare Workers

基于 Hono + Cloudflare D1 的后端 API 服务。

# 糖豆方块屋 API

基于 Hono 的后端 API 服务，支持两种开发模式。

## 本地开发

### 方式一：Node.js 本地服务器（推荐）

不依赖 Cloudflare Workers 运行时，适用于 Android / Termux / 受限环境。

```bash
npm run dev:node        # 启动 → http://localhost:8787
```

- 数据库：项目根目录 `local-dev.db`（SQLite，由 `better-sqlite3` 驱动）
- 启动时自动执行 `schema.sql` 建表
- 代码热更：修改后重启即可（node 原生不支持 HMR）
- 部署时仍用 `npm run deploy`（wrangler deploy），完全不受影响

| 概念 | Node.js 本地 | Cloudflare Workers |
|------|-------------|-------------------|
| 数据库 | `better-sqlite3` → `local-dev.db` | D1 → `c.env.db` |
| 框架 | `@hono/node-server` | `wrangler dev` (miniflare) |
| 密钥 | `process.env.JWT_SECRET` | `c.env.JWT_SECRET` |
| 代码入口 | `src/dev-server.js` | `src/index.js` |

### 方式二：Wrangler 开发服务器

模拟 Cloudflare Workers 运行时（需要能访问网络）。

```bash
npm run dev             # wrangler dev → http://localhost:8787
```

## 本地数据库

### Node.js 模式（`npm run dev:node`）

- **文件位置**：`api/local-dev.db`
- **自动初始化**：启动时执行 `schema.sql`
- **重置数据库**：删除 `api/local-dev.db` 重新启动即可

### Wrangler 模式（`npm run dev`）

- **文件位置**：`.wrangler/state/d1/` 目录
- **手动初始化**：
  ```bash
  curl http://localhost:8787/api/init
  # 或
  npx wrangler d1 execute tdfkw --local --file=./schema.sql
  ```
- **重置数据库**：
  ```bash
  rm -rf .wrangler/state/d1/
  npm run dev
  ```

## 数据库结构

| 表名 | 说明 |
|------|------|
| `registerCodes` | 注册邀请码 — id, code, expires_at, is_used |
| `users` | 用户 — id, username, qq, password, email, created_at |
| `email_verifications` | 邮箱验证码 — email, code, otp_code, expires_at, created_at |

详情见 `schema.sql`。

## 快速测试

默认测试注册码：`1`（永不过期）

```bash
# 验证注册码
curl -X POST http://localhost:8787/api/validateRegisterCode \
  -H "Content-Type: application/json" -d '{"registerCode":"1"}'

# 登录
curl -X POST http://localhost:8787/api/login \
  -H "Content-Type: application/json" -d '{"username":"test","password":"..."}'
```

## API 接口

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/` | 无 | 健康检查 |
| GET | `/api/init` | 无 | 初始化数据库表 |
| POST | `/api/validateRegisterCode` | 无 | 验证注册码 |
| POST | `/api/send-otp` | 无 | 发送邮箱验证码 |
| POST | `/api/check-otp` | 无 | 校验 OTP 并注册 |
| POST | `/api/login` | 无 | 用户登录 |
| GET | `/api/me` | JWT | 获取当前用户信息 |

## 部署

```bash
npm run deploy
```

部署后访问 `https://<your-worker>/api/init` 初始化远程 D1 数据库。

## D1 数据库操作参考

```js
// 查询单条
const user = await c.env.db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first()

// 查询多条
const users = await c.env.db.prepare("SELECT * FROM users").all()

// 插入
const result = await c.env.db.prepare("INSERT INTO users (name) VALUES (?)").bind(name).run()
const lastId = result.meta.last_row_id

// 更新
await c.env.db.prepare("UPDATE users SET name = ? WHERE id = ?").bind(name, id).run()
```

## 故障排查

### wrangler 启动崩溃（TCMalloc / mmap 错误）

这是 Android / Termux / 受限容器环境的已知问题，改用 Node.js 模式：

```bash
npm run dev:node
```

### 端口被占用

```bash
PORT=8888 npm run dev:node
```

### 重置本地数据库

```bash
rm local-dev.db*        # Node.js 模式
# 或
rm -rf .wrangler/state/d1/   # Wrangler 模式
```
