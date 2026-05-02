# 糖豆方块屋 (TDFKW)

糖豆方块屋是一个 Minecraft 社区服务器官网项目，提供服务器信息展示、玩家注册、白名单申请和文档中心等功能。

## 技术栈

| 层面 | 技术 |
|---|---|
| 前端框架 | Vue 3 (Composition API) |
| 构建工具 | Vite 8 |
| 状态管理 | Pinia 3 |
| 路由 | Vue Router 5 |
| 后端框架 | Hono 4 (Cloudflare Workers) |
| 数据库 | Cloudflare D1 (SQLite) |
| 邮件服务 | Resend |
| 文档站点 | VitePress |
| 代码规范 | ESLint, Prettier, Oxlint |

## 项目结构

```
tdfkw/
├── tdfkw/                  # Vue 3 前端应用
│   ├── src/
│   │   ├── main.js         # 入口文件
│   │   ├── App.vue         # 根组件
│   │   ├── router/         # 路由配置
│   │   ├── stores/         # Pinia 状态管理
│   │   ├── utils/          # 工具函数（请求封装）
│   │   ├── views/          # 页面组件
│   │   └── components/     # 公共组件
│   ├── .env                # 环境变量（API 地址）
│   └── vite.config.js
├── serve/my-app/           # Hono 后端 API
│   ├── src/index.js        # API 入口（所有路由）
│   ├── schema.sql          # 数据库 schema
│   ├── wrangler.toml       # Cloudflare Workers 配置
│   └── data.db             # 本地开发数据库
├── docs/                   # VitePress 文档站点
└── picture/                # 静态图片资源
```

## 快速开始

确保安装了 Node.js >=20.19 或 >=22.12。

### 启动后端 API

```bash
cd serve/my-app
npm install
npm run dev          # wrangler dev，默认监听 127.0.0.1:8787
```

### 启动前端应用

```bash
cd tdfkw
npm install
npm run dev          # Vite 开发服务器
```

### 启动文档站点

```bash
cd docs
npm install
npm run docs:dev
```

### 初始化数据库

后端启动后，访问 `GET /api/init` 即可自动创建表结构并插入测试注册码。

## API 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/` | 健康检查 |
| `GET` | `/api/init` | 初始化数据库表 |
| `POST` | `/api/validateRegisterCode` | 验证注册码 |
| `POST` | `/api/send-otp` | 发送邮箱验证码 |
| `POST` | `/api/check-otp` | 校验验证码并注册 |
| `POST` | `/api/login` | 用户登录 |

## 服务器信息

- **连接地址**: `mc.tangdoufangkuaiwu.top`
- **游戏版本**: Minecraft 1.20.4 (Fabric)
- **登录方式**: 外置登录 ([Little Skin](https://littleskin.cn/))

## 分支命名规范

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
