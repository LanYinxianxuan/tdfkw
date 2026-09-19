# 开发手册

## 后端开发

### 路由模式

所有路由文件放在 `api/src/routes/` 下，每个文件导出一个 Hono 实例：

```js
import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth.js'
import { success, error } from '../utils/response.js'

const myRoute = new Hono()

// 公开路由
myRoute.get('/resource', async (c) => {
  try {
    const data = await c.env.db.prepare('SELECT ...').all()
    return success(c, data)
  } catch (e) {
    return error(c, e.message, 500)
  }
})

// 需登录的路由
myRoute.post('/resource', authMiddleware, async (c) => {
  const userId = c.get('userId')  // 从 JWT 中获取
  // ...
})

export default myRoute
```

然后在 `api/src/index.js` 中注册：

```js
import myRoute from './routes/myRoute.js'
app.route('/api', myRoute)
```

### 响应格式

统一使用 `success()` 和 `error()` 辅助函数：

```js
// 成功
return success(c, { id: 1, name: 'foo' })       // 200
return success(c, created, 201)                   // 201

// 错误
return error(c, '参数错误')                       // 400
return error(c, '未登录', 401)
return error(c, '无权限', 403)
return error(c, '不存在', 404)
return error(c, '服务器错误', 500)
```

所有响应结构为 `{ success: boolean, data?: any, error?: string }`。

### 输入校验

使用 Zod schema + `validate()` 辅助函数：

```js
import { z } from 'zod'
import { validate } from '../validation.js'

const mySchema = z.object({
  name: z.string().min(1, '名称不能为空'),
  age: z.number().min(0).max(150),
})

// 在 handler 中
const body = await c.req.json()
const err = validate(mySchema, body, c)
if (err) return err  // err 已经是 c.json() 响应
```

### 数据库操作

使用 D1 兼容的链式 API（本地和 Cloudflare Workers 通用）：

```js
// 查询多条
const rows = await c.env.db.prepare('SELECT * FROM t WHERE x = ?').bind(x).all()

// 查询单条
const row = await c.env.db.prepare('SELECT * FROM t WHERE id = ?').bind(id).first()

// 插入
const result = await c.env.db
  .prepare('INSERT INTO t (a, b) VALUES (?, ?)')
  .bind(a, b)
  .run()
const newId = result.meta.last_row_id

// 更新/删除
await c.env.db.prepare('DELETE FROM t WHERE id = ?').bind(id).run()
```

### 数据库迁移

修改 `api/schema.sql`，重启 dev-server 会自动执行 `CREATE TABLE IF NOT EXISTS`。

生产环境需要手动执行：

```bash
npx wrangler d1 execute tdfkw-db --file=./schema.sql
```

### CORS

CORS 在 `index.js` 中全局启用（`app.use('/*', cors())`），无需在每个路由中单独处理。

## 前端开发

### CSS 变量（设计令牌）

所有样式必须使用 CSS 变量，定义在 `tdfkw/src/assets/main.css`：

```css
/* 颜色 */
--color-bg: #ffffff;
--color-bg-secondary: #f5f5f5;
--color-bg-tertiary: #e8e8e8;
--color-text: #1a1a1a;
--color-text-secondary: #666666;
--color-text-muted: #999999;
--color-border: #e0e0e0;
--color-border-strong: #949494;
--color-accent: #1a1a1a;
--color-accent-hover: #000000;

/* 圆角 */
--radius-sm: 2px;
--radius-md: 4px;
--radius-lg: 6px;

/* 间距 */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
```

### 全局工具类

`main.css` 提供以下可直接使用的类：

| 类名 | 用途 |
|---|---|
| `.card` | 白底 + 边框 + 圆角面板 |
| `.page-center` | 垂直水平居中容器 |
| `.btn-primary` | 主按钮（黑底白字） |
| `.form-card` | 居中白色表单容器 |
| `.divider` | 灰色分隔线 |

### API 请求

使用 `request()` 封装（自动带 JWT）：

```js
import { request } from '@/utils/request.js'

// GET
const { ok, data } = await request('/api/some-endpoint')

// POST
const { ok, data } = await request('/api/some-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' }),
})

// 判断结果
if (!ok) {
  console.error(data.error)
}
```

### 用户状态

```js
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()

// 读取
userStore.isLoggedIn       // boolean
userStore.user             // { id, username, qq, email } | null

// 写入
userStore.setUser(data)    // 登录成功后调用
userStore.loadUser()       // 从 localStorage 恢复（App 启动时自动调用）
userStore.logout()         // 退出登录
```

### Toast 通知

```js
import { useToast } from '@/utils/toast.js'

const { success, error, info } = useToast()

success('操作成功')
error('操作失败')
info('提示信息')
```

### 弹窗 body 锁定

在弹窗组件中使用 `onMounted`/`onUnmounted` 锁定背景滚动：

```js
import { onMounted, onUnmounted } from 'vue'

onMounted(() => { document.body.style.overflow = 'hidden' })
onUnmounted(() => { document.body.style.overflow = '' })
```

并在 overlay 上添加 `@touchmove.self.prevent` 防止移动端穿透。

## 添加新页面

1. 在 `tdfkw/src/views/` 创建 `NewView.vue`
2. 在 `router/index.js` 添加路由（如果是 dashboard 子页面，加在 children 里）
3. 在 `SecNav.vue` 的 `navItems` 数组添加菜单项（如果需要侧边栏入口）
4. 如果是新功能需要后端接口，在 `api/src/routes/` 创建路由文件并在 `index.js` 注册

## 修改数据库结构

1. 编辑 `api/schema.sql`（所有变更用 `CREATE TABLE IF NOT EXISTS` 或 `ALTER TABLE`）
2. 本地：删除 `local-dev.db`，重启 dev-server 自动重建
3. 生产：`npx wrangler d1 execute tdfkw-db --file=./schema.sql`
