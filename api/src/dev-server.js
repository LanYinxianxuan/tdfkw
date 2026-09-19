/**
 * 本地 Node.js 开发服务器
 * 用 better-sqlite3 模拟 Cloudflare D1，不依赖 wrangler/miniflare
 *
 * 使用方式: node src/dev-server.js
 * 部署时仍用: npx wrangler deploy（完全不受影响）
 */
import { serve } from '@hono/node-server'
import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import app from './index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ——— 加载 .dev.vars（兼容 node 模式，wrangler 会自动加载此文件）———
const devVarsPath = join(__dirname, '..', '.dev.vars')
try {
  const devVars = readFileSync(devVarsPath, 'utf-8')
  devVars.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...rest] = trimmed.split('=')
      const value = rest.join('=').trim()
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value
      }
    }
  })
} catch (_) { /* .dev.vars 不存在，跳过 */ }

const DB_PATH = join(__dirname, '..', 'local-dev.db')

// ——— 初始化本地 SQLite ———
const sqlite = new Database(DB_PATH)
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

// 执行 schema.sql 建表
const schemaPath = join(__dirname, '..', 'schema.sql')
const schema = readFileSync(schemaPath, 'utf-8')
// 跳过注释行，逐条执行 SQL
schema
  .split(';')
  .map((s) => s.trim())
  .filter((s) => {
    // 去掉 -- 单行注释后再判断是否为空
    const stripped = s.replace(/--.*$/gm, '').trim()
    return stripped.length > 0
  })
  .forEach((sql) => sqlite.exec(sql + ';'))

console.log('📦 本地数据库已初始化:', DB_PATH)

// ——— D1 兼容包装器 ———
function createD1Wrapper(db) {
  function makeExecutable(stmt) {
    return {
      bind(...params) {
        if (params.length > 0) stmt.bind(params)
        return makeExecutable(stmt)
      },
      first() {
        return stmt.get() ?? null
      },
      run() {
        const r = stmt.run()
        return { meta: { last_row_id: r.lastInsertRowid, changes: r.changes } }
      },
      all() {
        return stmt.all()
      },
    }
  }

  return {
    prepare(sql) {
      return makeExecutable(db.prepare(sql))
    },
  }
}

// ——— 构造 env 绑定（模拟 Workers bindings）———
const env = {
  db: createD1Wrapper(sqlite),
  JWT_SECRET: process.env.JWT_SECRET || 'tdfkw-dev-secret',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  MONITOR_TOKEN: process.env.MONITOR_TOKEN || '',
  MONITOR_HOST: process.env.MONITOR_HOST || '',
}

// ——— 请求日志 ———
function log(method, path, status, ms, body) {
  const tag = status >= 400 ? '✗' : status >= 300 ? '→' : '✓'
  const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : status >= 300 ? '\x1b[36m' : '\x1b[32m'
  const reset = '\x1b[0m'
  const dim = '\x1b[2m'
  console.log(`${dim}${new Date().toLocaleTimeString()}${reset} ${color}${tag} ${method} ${path} ${status} ${ms}ms${reset}`)
  if (body) console.log(`  ${dim}→ ${body.slice(0, 200)}${reset}`)
}

async function handleRequest(request) {
  const start = Date.now()
  const { method } = request
  const url = new URL(request.url)
  const path = url.pathname + url.search

  try {
    const response = await app.fetch(request, env)
    const ms = Date.now() - start
    log(method, path, response.status, ms)
    return response
  } catch (err) {
    const ms = Date.now() - start
    console.error(`\x1b[31m✗ ${method} ${path} ${ms}ms\x1b[0m`)
    console.error(err)
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// ——— 启动服务器 ———
const port = parseInt(process.env.PORT || '8787')

serve(
  {
    fetch: handleRequest,
    port,
  },
  (info) => {
    console.log(`🚀 API 已启动: http://localhost:${info.port}`)
    console.log('   （本地开发模式，不依赖 wrangler/miniflare）')
  },
)
