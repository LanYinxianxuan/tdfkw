import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
const app = new Hono()
app.use('/*', cors())
const db = 
app.get('/api/registerIsReady', (c) => c.json({ registerIsReady: true }))

serve(app)