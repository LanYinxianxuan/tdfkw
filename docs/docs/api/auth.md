# 认证接口

## POST /api/login

用户登录。

**请求体：**
```json
{
  "username": "string (必填)",
  "password": "string (必填，SHA256 哈希后的密码)"
}
```

**成功响应 (200)：**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbG...",
    "user": {
      "id": 1,
      "username": "player",
      "email": "player@example.com",
      "qq": "12345678"
    }
  }
}
```

**错误响应：**
```json
{ "success": false, "error": "用户名或密码错误" }
```

> 前端先对密码做 SHA256 哈希，后端收到后再用 bcrypt 比对。

## GET /api/me

获取当前登录用户信息。

**请求头：** `Authorization: Bearer <token>`

**成功响应 (200)：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "player",
    "email": "player@example.com",
    "qq": "12345678"
  }
}
```

**错误响应 (401)：**
```json
{ "success": false, "error": "登录已过期，请重新登录" }
```
