# 部署指南

## 架构概览

```
┌──────────────────────────────────────┐
│  Cloudflare Pages                     │
│  tdfkw/ (Vue 3 SPA)                  │
│  https://tangdoufangkuaiwu.top       │
└──────────────┬───────────────────────┘
               │ fetch
               ▼
┌──────────────────────────────────────┐
│  Cloudflare Workers                   │
│  api/ (Hono 4)                        │
│  https://api.tangdoufangkuaiwu.top   │
└──────────────┬───────────────────────┘
               │ c.env.db
               ▼
┌──────────────────────────────────────┐
│  Cloudflare D1 (SQLite)               │
│  tdfkw-db                             │
└──────────────────────────────────────┘
```

## 部署后端 (API)

### 1. 创建 D1 数据库

```bash
cd api
npx wrangler d1 create tdfkw-db
```

将输出的 `database_id` 填入 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "db"
database_name = "tdfkw-db"
database_id = "your-database-id-here"
```

### 2. 初始化数据库表

```bash
npx wrangler d1 execute tdfkw-db --file=./schema.sql
```

### 3. 设置密钥

```bash
# JWT 签名密钥
npx wrangler secret put JWT_SECRET

# Resend API 密钥（邮件发送）
npx wrangler secret put RESEND_API_KEY

# 可选：监控 agent 配置
npx wrangler secret put MONITOR_TOKEN
npx wrangler secret put MONITOR_HOST
```

### 4. 部署

```bash
npm run deploy
```

部署后 API 地址为 `https://api.tangdoufangkuaiwu.top`（或在 `wrangler.toml` 中配置的自定义域名）。

## 部署前端

### 1. 配置生产环境 API 地址

编辑 `tdfkw/.env.production`：

```
VITE_API_BASE_URL=https://api.tangdoufangkuaiwu.top
```

### 2. 构建

```bash
cd tdfkw
npm run build
```

产出在 `tdfkw/dist/` 目录。

### 3. 部署到 Cloudflare Pages

**方式 A：通过 Wrangler**

```bash
npx wrangler pages deploy dist/
```

**方式 B：通过 Git 集成**

在 Cloudflare Dashboard → Pages → 连接 GitHub 仓库，设置：
- 构建命令：`cd tdfkw && npm install && npm run build`
- 构建输出目录：`tdfkw/dist`

### 4. 自定义域名

在 Cloudflare Pages → 自定义域 → 添加 `tangdoufangkuaiwu.top`。

### 5. 前端路由 SPA 回退

Cloudflare Pages 默认支持 SPA。如果遇到 404，在 Pages 设置中添加回退规则：

```
/ -> /index.html (200, rewrite)
```

或创建 `tdfkw/public/_redirects`：

```
/*    /index.html   200
```

## 部署监控 Agent

监控 agent 是一个 Python 脚本，部署在 Minecraft 服务器所在的 VPS 上，用于采集系统指标和 RCON 数据。

### 1. 上传脚本

```bash
scp api/monitor-agent.py root@<mc-server-ip>:/root/
```

### 2. 启动服务

```bash
ssh root@<mc-server-ip>
export MONITOR_TOKEN="your-secret-token"
export RCON_PASSWORD="your-rcon-password"
nohup python3 /root/monitor-agent.py > /var/log/monitor-agent.log 2>&1 &
```

Agent 监听 `http://0.0.0.0:9100`，提供 `/system` 和 `/minecraft` 端点。

> 注意：防火墙需开放 9100 端口给 API Worker 访问。

## 部署文档站点

```bash
cd docs
npm run docs:build       # 产出在 .vitepress/dist/
npx wrangler pages deploy .vitepress/dist/
```

## 环境变量参考

### 后端 (api/.dev.vars / Cloudflare Secrets)

| 变量 | 说明 | 示例 |
|---|---|---|
| `JWT_SECRET` | JWT 签名密钥 | `530925201105190017` |
| `RESEND_API_KEY` | Resend API 密钥 | `re_xxxx...` |
| `MONITOR_TOKEN` | 监控 agent 认证 token | `tdfkw-monitor-secret` |
| `MONITOR_HOST` | 监控 agent 地址 | `http://110.42.36.214:9100` |

### 前端 (tdfkw/.env / .env.production)

| 变量 | 说明 | 示例 |
|---|---|---|
| `VITE_API_BASE_URL` | 后端 API 地址 | `http://127.0.0.1:8787` (开发) / `https://api.tangdoufangkuaiwu.top` (生产) |
