# 糖豆方块屋 (TDFKW)

Minecraft 社区服务器官网 — 玩家注册、白名单、档案管理、工程协作、服务器监控一站式平台。

**服务器地址**: `mc.tangdoufangkuaiwu.top` · Minecraft 1.20.4 (Fabric) · 外置登录 ([Little Skin](https://littleskin.cn/))

## 技术栈

| 层面 | 技术 |
|---|---|
| 前端框架 | Vue 3 (Composition API) |
| 构建工具 | Vite 8 |
| 状态管理 | Pinia 3 |
| 路由 | Vue Router 5 |
| 后端框架 | Hono 4 |
| 数据库 | Cloudflare D1 (SQLite) |
| 认证 | JWT (jose, HS256) |
| 密码 | bcryptjs (SHA256 + bcrypt 双重哈希) |
| 邮件 | Resend |
| 校验 | Zod 4 |
| 部署 | Cloudflare Workers + Pages |
| 文档 | VitePress |

## 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/LanYinxianxuan/tdfkw.git && cd tdfkw

# 2. 启动后端 API
cd api && npm install && npm run dev:node     # http://localhost:8787

# 3. 启动前端
cd tdfkw && npm install && npm run dev        # http://localhost:5173

# 4. 初始化数据库
curl http://localhost:8787/api/init

# 5. 启动文档
cd docs && npm install && npm run docs:dev
```

> `npm run dev:node` 使用 `@hono/node-server` + `better-sqlite3` 本地运行，不依赖 wrangler，适用于 Android / Termux 等环境。

## 功能模块

### 用户系统
- 注册码 + 邮箱 OTP 双重验证注册
- JWT 登录认证（7 天有效期）
- QQ 号绑定，头像自动拉取

### 档案管理
- 文件上传/下载/删除，弹窗表单上传
- 按名称、作者搜索过滤
- 文件以 BLOB 存储在 D1 数据库中（≤ 5MB）

### 工程管理
- 生电工程全生命周期管理
- 负责人、企划人、参与人角色分工
- 预计工期、投影链接、工程地址
- 玩家自由加入/离开，创建者自动成为负责人

### 服务器监控
- Minecraft 服务器在线状态、玩家数、版本、MOTD 实时显示
- 系统指标：CPU、内存、磁盘、负载、网络、运行时间
- RCON 集成：TPS、在线玩家列表
- 网站自身健康检查

## 项目结构

```
tdfkw/
├── api/                    # Hono 4 后端 API
│   ├── src/
│   │   ├── index.js        # 入口 + 路由注册
│   │   ├── dev-server.js   # 本地开发服务器
│   │   ├── validation.js   # Zod 校验 schemas
│   │   ├── routes/         # 路由模块（8 个文件，21 个接口）
│   │   ├── middleware/      # CORS + JWT 中间件
│   │   └── utils/          # 响应格式、JWT、邮件
│   ├── schema.sql          # 数据库表结构
│   └── wrangler.toml       # Cloudflare Workers 配置
│
├── tdfkw/                  # Vue 3 前端 SPA
│   └── src/
│       ├── views/          # 12 个页面组件
│       ├── components/     # 4 个可复用组件
│       ├── stores/         # Pinia 状态管理
│       ├── utils/          # 请求封装、Toast 通知
│       └── assets/         # 全局样式、CSS 变量
│
├── docs/                   # VitePress 文档站点
└── picture/                # 静态图片资源
```

## API 接口

| 方法 | 路径 | 鉴权 | 说明 |
|---|---|---|---|
| `GET` | `/api/init` | 无 | 初始化数据库 |
| `POST` | `/api/login` | 无 | 用户登录 |
| `POST` | `/api/validateRegisterCode` | 无 | 验证注册码 |
| `POST` | `/api/send-otp` | 无 | 发送邮箱验证码 |
| `POST` | `/api/check-otp` | 无 | 校验 OTP + 注册 |
| `GET` | `/api/me` | JWT | 当前用户信息 |
| `GET` | `/api/files` | 无 | 档案列表 |
| `GET` | `/api/files/:id` | 无 | 档案详情 |
| `POST` | `/api/files` | JWT | 上传档案 |
| `DELETE` | `/api/files/:id` | JWT | 删除档案 |
| `GET` | `/api/projects` | 无 | 工程列表 |
| `GET` | `/api/projects/:id` | 无 | 工程详情 |
| `POST` | `/api/projects` | JWT | 创建工程 |
| `POST` | `/api/projects/:id/join` | JWT | 加入工程 |
| `POST` | `/api/projects/:id/leave` | JWT | 离开工程 |
| `DELETE` | `/api/projects/:id` | JWT | 删除工程 |
| `GET` | `/api/monitor/minecraft` | 无 | MC 服务器状态 |
| `GET` | `/api/monitor/system` | JWT | 系统指标 |
| `GET` | `/api/monitor/minecraft-local` | JWT | MC RCON 状态 |
| `GET` | `/api/monitor/health` | 无 | 网站健康检查 |

## 部署

详见 [部署指南](https://github.com/LanYinxianxuan/tdfkw/blob/main/docs/docs/guide/deployment.md)。

```bash
# 后端
cd api
npx wrangler d1 create tdfkw-db
npx wrangler d1 execute tdfkw-db --file=./schema.sql
npx wrangler secret put JWT_SECRET
npx wrangler secret put RESEND_API_KEY
npm run deploy

# 前端
cd tdfkw
npm run build
npx wrangler pages deploy dist/

# 文档
cd docs
npm run docs:build
npx wrangler pages deploy .vitepress/dist/
```

## 环境变量

### 后端 (`api/.dev.vars`)

| 变量 | 必填 | 说明 |
|---|---|---|
| `JWT_SECRET` | 是 | JWT 签名密钥 |
| `RESEND_API_KEY` | 是 | Resend 邮件 API 密钥 |
| `MONITOR_TOKEN` | 否 | 监控 agent 认证 token |
| `MONITOR_HOST` | 否 | 监控 agent 地址 |

### 前端 (`tdfkw/.env`)

| 变量 | 说明 |
|---|---|
| `VITE_API_BASE_URL` | 后端 API 地址 |

## 文档

完整文档请访问 [docs.tangdoufangkuaiwu.top](https://docs.tangdoufangkuaiwu.top) 或本地运行：

```bash
cd docs && npm run docs:dev
```

文档涵盖：
- 快速开始指南
- 项目结构详解
- 开发手册（CSS 变量、API 请求、组件模式、路由、数据库）
- 部署指南（Cloudflare Workers + Pages + D1 + 监控 Agent）
- API 完整参考（21 个接口）


## 分支命名

- `feature/` — 新功能
- `fix/` — Bug 修复
- `docs/` — 文档更新
- `refactor/` — 代码重构
- `chore/` — 构建/依赖维护

## 参与开发

- **Email**: lanyinxianxuan@163.com
- **GitHub**: [LanYinxianxuan/tdfkw](https://github.com/LanYinxianxuan/tdfkw)

## 开源协议

MIT License

---

Copyright &copy; 2024–2026 糖豆方块屋
