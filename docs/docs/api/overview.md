# API 概览

所有 API 响应格式统一为：

```json
{
  "success": true,
  "data": { ... }
}

// 或错误时
{
  "success": false,
  "error": "错误信息"
}
```

## 基础地址

| 环境 | 地址 |
|---|---|
| 本地开发 | `http://127.0.0.1:8787` |
| 生产环境 | `https://api.tangdoufangkuaiwu.top` |

## 认证

需要登录的接口在请求头中携带 JWT：

```
Authorization: Bearer <token>
```

JWT 通过登录或注册接口获取，有效期 7 天。

## 接口总览

| 方法 | 路径 | 鉴权 | 说明 |
|---|---|---|---|
| `GET` | `/` | 无 | 健康检查 |
| `GET` | `/api/init` | 无 | 初始化数据库表 |
| **认证** | | | |
| `POST` | `/api/login` | 无 | 用户登录 |
| `POST` | `/api/validateRegisterCode` | 无 | 验证注册码 |
| `POST` | `/api/send-otp` | 无 | 发送邮箱验证码 |
| `POST` | `/api/check-otp` | 无 | 校验 OTP 并注册 |
| `GET` | `/api/me` | JWT | 当前用户信息 |
| **档案** | | | |
| `GET` | `/api/files` | 无 | 档案列表 |
| `GET` | `/api/files/:id` | 无 | 档案详情（含下载数据） |
| `POST` | `/api/files` | JWT | 上传档案 |
| `DELETE` | `/api/files/:id` | JWT | 删除档案 |
| **工程** | | | |
| `GET` | `/api/projects` | 无 | 工程列表 |
| `GET` | `/api/projects/:id` | 无 | 工程详情 + 成员 |
| `POST` | `/api/projects` | JWT | 创建工程 |
| `POST` | `/api/projects/:id/join` | JWT | 加入工程 |
| `POST` | `/api/projects/:id/leave` | JWT | 离开工程 |
| `DELETE` | `/api/projects/:id` | JWT | 删除工程 |
| **监控** | | | |
| `GET` | `/api/monitor/minecraft` | 无 | MC 服务器状态 |
| `GET` | `/api/monitor/system` | JWT | 系统指标 |
| `GET` | `/api/monitor/minecraft-local` | JWT | MC RCON 状态 |
| `GET` | `/api/monitor/health` | 无 | 网站健康检查 |

## 错误码

| HTTP 状态码 | 含义 |
|---|---|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或 token 过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 429 | 请求频率限制 |
| 500 | 服务器内部错误 |
