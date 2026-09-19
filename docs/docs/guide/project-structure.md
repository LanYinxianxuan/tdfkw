# 项目结构

```
tdfkw/
├── README.md                        # 项目说明
├── api/                             # Hono 4 后端 API（Cloudflare Workers）
│   ├── package.json
│   ├── wrangler.toml                # Cloudflare Wrangler 配置（D1 绑定）
│   ├── schema.sql                   # 数据库表结构
│   ├── .dev.vars.example            # 本地环境变量模板
│   ├── local-dev.db                 # 本地 SQLite 数据库（自动生成，gitignore）
│   └── src/
│       ├── index.js                 # 入口：组合所有路由 + CORS
│       ├── dev-server.js            # Node.js 本地开发服务器（better-sqlite3 + @hono/node-server）
│       ├── validation.js            # Zod 输入校验 schemas
│       ├── routes/
│       │   ├── health.js            # GET /              健康检查
│       │   ├── init.js              # GET /api/init      数据库初始化
│       │   ├── auth.js              # POST /api/login    用户登录
│       │   ├── register.js          # 注册码验证 / OTP / 注册
│       │   ├── me.js                # GET /api/me        当前用户信息（JWT）
│       │   ├── files.js             # 档案文件 CRUD（上传/列表/下载/删除）
│       │   ├── projects.js          # 工程项目管理（CRUD + 加入/离开）
│       │   └── monitor.js           # 服务器监控（MC 状态 / 系统指标 / 健康检查）
│       ├── middleware/
│       │   ├── cors.js              # CORS 中间件
│       │   └── auth.js              # JWT 验证中间件
│       └── utils/
│           ├── response.js          # 统一响应：success() / error()
│           ├── jwt.js               # JWT 签发与验证（jose）
│           └── resend.js            # Resend 邮件客户端
│
├── tdfkw/                           # Vue 3 前端 SPA
│   ├── package.json
│   ├── vite.config.js
│   ├── .env / .env.production       # 环境变量（API 地址）
│   └── src/
│       ├── main.js                  # 入口：注册全局组件 + 路由 + Pinia
│       ├── App.vue                  # 根组件：router-view + Toast + Footer
│       ├── router/index.js          # 路由配置（10+ 条路由，懒加载）
│       ├── stores/user.js           # Pinia 用户状态（JWT + localStorage）
│       ├── assets/main.css          # 全局样式 + CSS 变量（设计令牌）
│       ├── utils/
│       │   ├── request.js           # fetch 封装（自动带 JWT）
│       │   └── toast.js             # 全局 Toast 通知
│       ├── views/                   # 页面组件
│       │   ├── HomeView.vue         # 首页
│       │   ├── StartView.vue        # 登录页
│       │   ├── RegisterView.vue     # 注册码验证
│       │   ├── WhitelistView.vue    # 白名单/邮箱注册
│       │   ├── DashboardView.vue    # 仪表盘布局（侧边栏 + router-view）
│       │   ├── DashboardHomeView.vue# 仪表盘首页（用户信息 + 公告 + 赞助）
│       │   ├── UserDataView.vue     # （已重定向到 /dashboard）
│       │   ├── FilesView.vue        # 档案列表 + 上传弹窗
│       │   ├── ProjectsView.vue     # 工程列表 + 创建/详情弹窗
│       │   ├── ServerStatusView.vue # 服务器监控面板
│       │   ├── AboutView.vue        # 关于页
│       │   └── ContactView.vue      # 联系页
│       └── components/              # 可复用组件
│           ├── NAV.vue               # 顶部导航（全局注册）
│           ├── SecNav.vue            # 侧边栏（仪表盘/档案/服务器/工程）
│           ├── AppToast.vue          # Toast 通知组件
│           └── UploadModal.vue       # 档案上传弹窗
│
├── docs/                            # VitePress 文档站点
│   ├── package.json
│   ├── .vitepress/
│   │   └── config.mjs               # VitePress 配置
│   └── docs/
│       ├── index.md                 # 文档首页
│       ├── guide/                   # 开发指南
│       │   ├── getting-started.md
│       │   ├── project-structure.md
│       │   ├── development.md
│       │   └── deployment.md
│       └── api/                     # API 文档
│           ├── overview.md
│           ├── auth.md
│           ├── register.md
│           ├── files.md
│           ├── projects.md
│           └── monitor.md
│
└── picture/                         # 静态图片资源
```

## 数据流

```
浏览器 (Vue 3 SPA)
   │  fetch + JWT (Authorization: Bearer xxx)
   ▼
Hono API (Cloudflare Workers / Node.js)
   │  c.env.db (D1 / better-sqlite3)
   ▼
SQLite 数据库 (D1 / local-dev.db)
```

## 关键技术选型

| 层面 | 技术 | 说明 |
|---|---|---|
| 前端框架 | Vue 3 Composition API | `<script setup>` 语法 |
| 构建 | Vite 8 | 开发热更新 + 生产构建 |
| 状态管理 | Pinia 3 | userStore（JWT + localStorage 持久化）|
| 路由 | Vue Router 5 | 懒加载，路由守卫 |
| 后端框架 | Hono 4 | 轻量级，Cloudflare Workers 原生支持 |
| 数据库 | Cloudflare D1 (SQLite) | 本地用 better-sqlite3 模拟 |
| 认证 | JWT (HS256, jose) | 7 天有效期 |
| 密码 | bcryptjs | SHA256（前端）+ bcrypt（后端）双重哈希 |
| 邮件 | Resend | 发送 OTP 验证码 |
| 校验 | Zod 4 | 输入 schema 校验 |
| 部署 | Cloudflare Workers + Pages | API + 前端统一在 Cloudflare |
| 文档 | VitePress | 静态站点生成 |
