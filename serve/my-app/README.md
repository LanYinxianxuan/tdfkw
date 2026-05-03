# 糖豆方块屋 API - Cloudflare Workers

基于 Hono + Cloudflare D1 的后端 API 服务。

## 从 Node.js 迁移到 Cloudflare Workers

### 主要差异

| Node.js                   | Cloudflare Workers   |
| ------------------------- | -------------------- |
| `better-sqlite3`          | D1 Database          |
| `nodemailer`              | Mailchannels / fetch |
| `process.env`             | `c.env`              |
| `new Database('data.db')` | `c.env.db.prepare()` |
| `serve(app)`              | `export default app` |

### 快速开始

#### 1. 安装依赖

```bash
npm install
```

#### 2. 配置 wrangler.toml

```toml
[[d1_databases]]
binding = "db"
database_name = "tdfkw"
database_id = "your-database-id"  # 需要先创建获取

[vars]
EMAIL_USER = "your-email@163.com"
```

#### 3. 创建 D1 数据库（首次）

##### 3.1 快速创建（推荐）

```bash
cd serve/my-app

# 方式A: 启动开发服务器自动创建本地数据库
npm run dev

# 在另一个终端初始化数据库表
curl http://localhost:8787/api/init
```

##### 3.2 手动创建本地数据库

```bash
cd serve/my-app

# 使用 npx wrangler 执行 schema.sql 初始化本地数据库
npx wrangler d1 execute tdfkw --local --file=./schema.sql
```

##### 3.3 创建远程数据库（Cloudflare）

```bash
# 创建远程 D1 数据库
npm run d1:create

# 查看返回的 database_id，复制到 wrangler.toml 的 [[d1_databases]] 配置
# database_id = "复制这个ID"

# 初始化远程数据库表（需先部署）
npm run deploy
# 然后执行初始化
curl https://your-worker-url/api/init
```

#### 4. 本地开发

```bash
npm run dev
```

访问 `http://localhost:8787`

## 本地数据库说明

### 本地 D1 数据库文件

在开发模式运行 `npm run dev` 时，Wrangler 会自动创建本地 D1 数据库文件：

- **位置**: `.wrangler/state/d1/` 目录
- **数据库文件**: `tdfkw.db`（SQLite 格式）
- **生命周期**:
  - 开发时自动创建并存储
  - 每次 `npm run dev` 时会恢复或初始化
  - 数据会持久化到文件中

### 初始化数据库表

首次运行时，访问以下 API 端点自动创建所有必要的表：

```bash
# 方式1: 通过 API 初始化（推荐）
curl http://localhost:8787/api/init
```

或在 `.wrangler/state/d1/` 中直接执行 SQL：

```bash
# 方式2: 通过 npx wrangler 直接执行 schema.sql
cd serve/my-app
npx wrangler d1 execute tdfkw --local --file=./schema.sql
```

### 数据库结构

自动创建的表有：

1. **registerCodes** - 注册邀请码表
   - id: 自增主键
   - code: 邀请码（唯一）
   - expires_at: 过期时间
   - is_used: 是否已使用

2. **users** - 用户表
   - id: 自增主键
   - username: 用户名（唯一）
   - qq: QQ号（唯一）
   - password: 密码
   - email: 邮箱（唯一）
   - created_at: 创建时间

3. **email_verifications** - 邮箱验证码表
   - email: 主键
   - code: 注册码
   - qq: QQ号
   - otp_code: 一次性验证码
   - expires_at: 过期时间

### 本地测试

**默认测试邀请码**: `1`（在初始化时自动创建，永不过期）

使用流程：

```bash
# 1. 验证邀请码
curl -X POST http://localhost:8787/api/validateRegisterCode \
  -H "Content-Type: application/json" \
  -d '{"registerCode": "1"}'

# 2. 发送邮箱验证码（返回开发环境验证码）
curl -X POST http://localhost:8787/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "code": "1", "qq": "123456"}'

# 3. 检验验证码并注册
curl -X POST http://localhost:8787/api/check-otp \
  -H "Content-Type: application/json" \
  -d '{"code": "1", "email": "test@example.com", "otp": "123456", "password": "pwd123", "username": "testuser", "qq": "123456"}'

# 4. 登录
curl -X POST http://localhost:8787/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "pwd123"}'
```

### 清理数据库

如需重置本地数据库：

```bash
# 删除本地数据库文件
rm -rf .wrangler/state/d1/

# 重新启动开发服务器会自动创建新数据库
npm run dev
```

#### 5. 部署到 Cloudflare

```bash
# 部署代码
npm run deploy

# 初始化远程数据库表
# 访问 https://your-worker.your-subdomain.workers.dev/api/init
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

| 方法 | 路径                        | 说明             |
| ---- | --------------------------- | ---------------- |
| GET  | `/api/init`                 | 初始化数据库表   |
| POST | `/api/validateRegisterCode` | 验证注册码       |
| POST | `/api/send-otp`             | 发送邮箱验证码   |
| POST | `/api/check-otp`            | 验证码校验并注册 |
| POST | `/api/login`                | 用户登录         |
| GET  | `/`                         | 健康检查         |

### D1 数据库操作

#### 查询单条

```js
const user = await c.env.db
  .prepare("SELECT * FROM users WHERE id = ?")
  .bind(id)
  .first();
```

#### 查询多条

```js
const users = await c.env.db.prepare("SELECT * FROM users").all();
```

#### 插入数据

```js
const result = await c.env.db
  .prepare("INSERT INTO users (name) VALUES (?)")
  .bind(name)
  .run();
const lastId = result.meta.last_row_id;
```

#### 更新数据

```js
await c.env.db
  .prepare("UPDATE users SET name = ? WHERE id = ?")
  .bind(name, id)
  .run();
```

### 邮件发送

使用 Mailchannels（免费，无需注册）：

```js
await fetch("https://api.mailchannels.net/tx/v1/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    personalizations: [{ to: [{ email: "to@example.com" }] }],
    from: { email: "from@example.com", name: "Sender" },
    content: [{ type: "text/plain", value: "Hello" }],
  }),
});
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

## 本地开发流程

### 方式一：本地模拟（推荐用于快速测试）

```bash
# 1. 创建本地数据库
wrangler d1 execute tdfkw-db --local --file=./schema.sql

# 2. 启动本地开发服务器
wrangler dev --local

# 3. 访问 http://localhost:8787
```

### 方式二：连接远程数据库（推荐用于真实测试）

```bash
# 1. 确保远程数据库已创建并配置好 database_id

# 2. 启动开发服务器（连接远程）
wrangler dev --remote

# 3. 访问 http://localhost:8787
# 注意：这会直接操作远程数据库
```

### 查询数据库

```bash
# 查询本地数据库
wrangler d1 execute tdfkw-db --local --command "SELECT * FROM users"

# 查询远程数据库
wrangler d1 execute tdfkw-db --command "SELECT * FROM users"
```

### 注意事项

1. **数据库绑定**: 使用 `c.env.db` 访问 D1
2. **环境变量**: 使用 `c.env.VAR_NAME` 访问
3. **异步操作**: D1 所有操作都是异步的，需要 `await`
4. **邮件发送**: Workers 不支持 SMTP，使用 HTTP API

## 故障排查

### 数据库创建相关

#### 问题：`bash: wrangler: command not found`

**解决方案**：使用 `npx` 运行 wrangler

```bash
cd serve/my-app
npx wrangler d1 execute tdfkw --local --file=./schema.sql
```

#### 问题：本地数据库文件损坏或需要重置

**解决方案**：删除临时文件并重新初始化

```bash
cd serve/my-app
rm -rf .wrangler/state .wrangler/tmp
npm run dev
# 在另一个终端
curl http://localhost:8787/api/init
```

#### 问题：验证码一直显示错误

**可能原因**：

- 邮箱已存在，旧验证码未更新 ✅ 已修复（使用 INSERT OR REPLACE）
- OTP 过期（10分钟）
- 数据库没有初始化

**排查步骤**：

```bash
# 1. 检查验证码是否保存
npx wrangler d1 execute tdfkw --local --command "SELECT * FROM email_verifications"

# 2. 清空验证表重新测试
npx wrangler d1 execute tdfkw --local --command "DELETE FROM email_verifications"

# 3. 查看后端日志
# npm run dev 时的控制台会显示 [开发模式] 邮箱: xxx, 验证码: 123456
```

### 开发服务器相关

#### 问题：端口被占用

**解决方案**：修改 wrangler.toml

```toml
[env.development]
port = 8888  # 改为其他端口
```

#### 问题：CORS 错误

**检查**：已在代码中配置了 CORS 中间件

```js
app.use("/*", cors());
```
