import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth.js'
import { success, error } from '../utils/response.js'

const monitor = new Hono()

const MC_HOST = 'mc.tangdoufangkuaiwu.top'

// GET /api/monitor/minecraft — MC 服务器状态（公开，代理 mcsrvstat.us）
monitor.get('/monitor/minecraft', async (c) => {
  try {
    const resp = await fetch(`https://api.mcsrvstat.us/2/${MC_HOST}`, {
      headers: { 'User-Agent': 'TDFKW/1.0' },
    })

    if (!resp.ok) {
      return success(c, { online: false, error: 'upstream_unavailable' })
    }

    const raw = await resp.json()

    // 扁平化提取需要的字段
    const data = {
      online: raw.online ?? false,
      hostname: raw.hostname || MC_HOST,
      ip: raw.ip || null,
      port: raw.port || 25565,
      version: raw.version || null,
      motd: raw.motd?.clean?.join('\n') || raw.motd?.raw?.[0] || '',
      players_online: raw.players?.online ?? 0,
      players_max: raw.players?.max ?? 0,
      players: raw.players?.list || raw.info?.clean || [],
      fetched_at: new Date().toISOString(),
    }

    return success(c, data)
  } catch (e) {
    return success(c, { online: false, error: e.message })
  }
})

// GET /api/monitor/system — 系统指标（需登录），代理到 MC 服务器上的 monitor-agent
monitor.get('/monitor/system', authMiddleware, async (c) => {
  const host = c.env.MONITOR_HOST
  const token = c.env.MONITOR_TOKEN

  if (!host) {
    return success(c, { node_only: true, message: 'MONITOR_HOST 未配置' })
  }

  try {
    const resp = await fetch(`${host}/system`, {
      headers: { Authorization: `Bearer ${token || ''}` },
    })

    if (!resp.ok) {
      const body = await resp.text()
      return success(c, { error: true, message: `monitor-agent 返回 ${resp.status}: ${body}` })
    }

    return success(c, await resp.json())
  } catch (e) {
    return success(c, { error: true, message: '无法连接 monitor-agent: ' + e.message })
  }
})

// GET /api/monitor/minecraft-local — MC 服务器 RCON 状态（需登录），代理到 monitor-agent
monitor.get('/monitor/minecraft-local', authMiddleware, async (c) => {
  const host = c.env.MONITOR_HOST
  const token = c.env.MONITOR_TOKEN

  if (!host) {
    return success(c, { node_only: true, message: 'MONITOR_HOST 未配置' })
  }

  try {
    const resp = await fetch(`${host}/minecraft`, {
      headers: { Authorization: `Bearer ${token || ''}` },
    })

    if (!resp.ok) {
      const body = await resp.text()
      return success(c, { error: true, message: `monitor-agent 返回 ${resp.status}: ${body}` })
    }

    return success(c, await resp.json())
  } catch (e) {
    return success(c, { error: true, message: '无法连接 monitor-agent: ' + e.message })
  }
})

// GET /api/monitor/health — 网站自身健康检查（公开）
monitor.get('/monitor/health', async (c) => {
  const result = { api: 'ok', database: 'ok', timestamp: new Date().toISOString() }

  try {
    await c.env.db.prepare('SELECT 1').first()
  } catch (e) {
    result.database = 'error'
    result.db_error = e.message
  }

  return success(c, result)
})

export default monitor
