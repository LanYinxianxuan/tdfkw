# tdfkw 后端服务

这是为 `tdfkw` 前端项目准备的快速开发后端，使用 `Node.js + Express`。

## 启动

1. 进入后端目录：

```bash
cd /workspaces/tdfkw/serve
```

2. 安装依赖：

```bash
npm install
```

3. 启动服务：

```bash
npm start
```

```

## 可用接口

- `GET /api/status` - 服务状态
- `POST /api/login` - 登录
- `POST /api/send-code` - 发送邮箱验证码（模拟）
- `POST /api/register` - 注册
- `POST /api/whitelist` - 提交白名单申请
- `GET /api/whitelist` - 查询白名单列表

## 说明

- 当前后端使用内存存储 `users`、`whitelist` 和 `emailCodes`，重启后数据会丢失。
- 开发时前端可使用 `http://localhost:3000` 访问后端。
- 已开启 CORS，允许 `http://localhost:5173` 访问。
```
