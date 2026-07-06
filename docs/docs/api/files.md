# 档案文件接口

## GET /api/files

获取所有档案列表（公开）。

**成功响应：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "测试档案",
      "author": "作者名",
      "introduction": "介绍文字",
      "filename": "test.txt",
      "mime_type": "text/plain",
      "size": 1024,
      "uploader_id": 1,
      "created_at": "2026-07-06 14:25:41"
    }
  ]
}
```

## GET /api/files/:id

获取单个档案详情（含 base64 编码的文件数据用于下载）。

**成功响应：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "测试档案",
    "author": "作者名",
    "introduction": "介绍",
    "filename": "test.txt",
    "mimeType": "text/plain",
    "size": 17,
    "data": "SGVsbG8gV29ybGQ=",
    "uploaderId": 1,
    "createdAt": "2026-07-06T14:25:41.000Z"
  }
}
```

## POST /api/files

上传档案。**需登录。**

**请求体：**
```json
{
  "name": "string (必填，最多100字)",
  "author": "string (必填，最多50字)",
  "introduction": "string (可选，最多500字)",
  "filename": "string (必填，原始文件名)",
  "mimeType": "string (默认 application/octet-stream)",
  "data": "string (必填，base64 编码的文件内容，解码后 ≤ 5MB)"
}
```

**成功响应 (201)：**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "新档案",
    "author": "作者",
    "introduction": "",
    "filename": "doc.pdf",
    "mime_type": "application/pdf",
    "size": 102400,
    "uploader_id": 1,
    "created_at": "2026-07-06T15:00:00.000Z"
  }
}
```

## DELETE /api/files/:id

删除档案。**需登录**，仅上传者本人可删。

**成功响应：**
```json
{ "success": true, "data": { "id": 1 } }
```

**错误响应 (403)：**
```json
{ "success": false, "error": "只能删除自己上传的档案" }
```
