# 工程项目接口

## GET /api/projects

获取所有工程列表（公开）。

**成功响应：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "史莱姆农场",
      "description": "沼泽地建史莱姆农场",
      "leader_name": "builder",
      "creator_name": "builder",
      "planner": "Notch",
      "address": "沼泽 (-200,64,300)",
      "schematic_url": "https://example.com/slime.litematic",
      "start_date": "2026-07-10",
      "expected_end_date": "2026-07-20",
      "status": "planning",
      "member_count": 3,
      "created_at": "2026-07-06T15:44:32.000Z"
    }
  ]
}
```

> `status` 可能值：`planning`（规划中）、`in_progress`（进行中）、`completed`（已完成）

## GET /api/projects/:id

获取工程详情（含完整成员列表）。

**成功响应：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "史莱姆农场",
    "...": "（所有工程字段）",
    "members": [
      {
        "id": 1,
        "user_id": 1,
        "username": "builder",
        "qq": "87654321",
        "role": "leader",
        "joined_at": "2026-07-06T15:44:32.000Z"
      }
    ]
  }
}
```

## POST /api/projects

创建工程。**需登录。** 创建者自动成为负责人（leader）并加入工程。

**请求体：**
```json
{
  "name": "string (必填)",
  "description": "string (可选)",
  "planner": "string (可选，企划人名字)",
  "address": "string (可选，工程坐标/地址)",
  "schematic_url": "string (可选，Litematica 投影下载链接)",
  "start_date": "string (可选，ISO 日期)",
  "expected_end_date": "string (可选，预计完成日期)"
}
```

**成功响应 (201)：**
```json
{ "success": true, "data": { "id": 1, "name": "...", "status": "planning", ... } }
```

## POST /api/projects/:id/join

加入工程。**需登录。** 如果已加入则返回错误。

**成功响应：**
```json
{ "success": true, "data": { "joined": true } }
```

## POST /api/projects/:id/leave

离开工程。**需登录。** 负责人不能离开。

**成功响应：**
```json
{ "success": true, "data": { "left": true } }
```

**错误响应 (400)：**
```json
{ "success": false, "error": "负责人不能离开工程，请先转让负责人" }
```

## DELETE /api/projects/:id

删除工程。**需登录**，仅创建者或负责人可删。

**成功响应：**
```json
{ "success": true, "data": { "deleted": true } }
```
