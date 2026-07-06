# 快速开始

确保安装了 Node.js >=20.19 或 >=22.12。

## 1. 克隆项目

```bash
git clone https://github.com/LanYinxianxuan/tdfkw.git
cd tdfkw
```

## 2. 启动后端 API

```bash
cd api
npm install
npm run dev:node     # 本地开发（推荐）
```

> `npm run dev:node` 使用 `@hono/node-server` + `better-sqlite3`，不依赖 wrangler/miniflare，适用于 Android/Termux/受限容器。部署时仍用 `npm run deploy`。

API 默认监听 `http://localhost:8787`。

### 环境变量

复制 `.dev.vars.example` 为 `.dev.vars` 并填写：

```bash
cp .dev.vars.example .dev.vars
```

| 变量 | 必填 | 说明 |
|---|---|---|
| `JWT_SECRET` | 是 | JWT 签名密钥 |
| `RESEND_API_KEY` | 是 | Resend 邮件 API 密钥（用于发送 OTP） |
| `MONITOR_TOKEN` | 否 | 监控 agent 认证 token |
| `MONITOR_HOST` | 否 | 监控 agent 地址（如 `http://110.42.36.214:9100`） |

## 3. 启动前端

```bash
cd tdfkw
npm install
npm run dev          # Vite 开发服务器，默认 http://localhost:5173
```

前端 `.env` 中配置 API 地址：

```
VITE_API_BASE_URL=http://127.0.0.1:8787
```

## 4. 初始化数据库

后端启动后，访问 `GET http://localhost:8787/api/init` 即可自动建表并插入测试注册码 `1`。

## 5. 启动文档站点

```bash
cd docs
npm install
npm run docs:dev    # http://localhost:5173
```

## 下一步

- 阅读[项目结构](/guide/project-structure)了解代码组织
- 查看[开发手册](/guide/development)了解开发规范
- 参考[部署指南](/guide/deployment)部署到生产环境
