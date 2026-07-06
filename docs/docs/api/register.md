# 注册接口

## 注册流程

```
验证注册码 → 填写信息 → 发送邮箱验证码 → 校验验证码 + 创建账号
```

## POST /api/validateRegisterCode

验证注册码是否有效。

**请求体：**
```json
{ "registerCode": "string (必填)" }
```

**成功响应 (200)：**
```json
{ "success": true, "data": { "code": "1" } }
```

**错误响应：**
```json
{ "success": false, "error": "注册码无效或已过期" }
```

> 注册码 `"1"` 为测试用，永久有效，可重复使用。

## POST /api/send-otp

发送 6 位邮箱验证码。

**请求体：**
```json
{
  "email": "string (必填，有效邮箱)",
  "code": "string (必填，已通过的注册码)"
}
```

**限制：**
- 同一邮箱 60 秒内只能发送一次
- 同一邮箱每小时最多 5 次

**成功响应 (200)：**
```json
{ "success": true, "data": { "id": "email-message-id" } }
```

## POST /api/check-otp

校验验证码并创建用户。

**请求体：**
```json
{
  "code": "string (注册码)",
  "email": "string (邮箱)",
  "otp": "string (6位验证码)",
  "password": "string (SHA256 哈希后的密码，至少8位)",
  "username": "string (2-16位)",
  "qq": "string (5-11位数字)"
}
```

**成功响应 (200)：**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbG...",
    "user": { "id": 1, "username": "player", "email": "player@example.com", "qq": "12345678" }
  }
}
```

**错误响应：**
```json
{ "success": false, "error": "验证码错误或已过期" }
```
