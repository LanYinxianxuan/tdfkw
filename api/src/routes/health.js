import { Hono } from 'hono'
import { success } from '../utils/response.js'

const health = new Hono()

health.get('/', (c) => success(c, { status: 'ok', message: '糖豆方块屋 API' }))

export default health
