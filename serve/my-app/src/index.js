import { Hono } from 'hono'
import { cors } from 'hono/cors'
import health from './routes/health.js'
import auth from './routes/auth.js'
import register from './routes/register.js'
import init from './routes/init.js'
import me from './routes/me.js'

const app = new Hono()

app.use('/*', cors())

app.route('/', health)
app.route('/api', init)
app.route('/api', auth)
app.route('/api', register)
app.route('/api', me)

export default app
