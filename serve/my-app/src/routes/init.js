import { Hono } from 'hono'
import { success, error } from '../utils/response.js'

const init = new Hono()

init.get('/init', async (c) => {
  try {
    await c.env.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS registerCodes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          expires_at DATETIME NOT NULL,
          is_used INTEGER DEFAULT 0
        )`,
      )
      .run()

    await c.env.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          qq TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          email TEXT UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
      )
      .run()

    await c.env.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS email_verifications (
          email TEXT PRIMARY KEY,
          code TEXT NOT NULL,
          otp_code TEXT NOT NULL,
          expires_at DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
      )
      .run()

    await c.env.db
      .prepare(`INSERT OR IGNORE INTO registerCodes (code, expires_at, is_used) VALUES (?, ?, ?)`)
      .bind('1', '2099-12-31T23:59:59.000Z', 0)
      .run()

    return success(c, { message: '数据库初始化成功' })
  } catch (e) {
    return error(c, e.message, 500)
  }
})

export default init
