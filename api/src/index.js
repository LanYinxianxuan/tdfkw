import { Hono } from 'hono'
import { cors } from 'hono/cors'
import health from './routes/health.js'
import auth from './routes/auth.js'
import register from './routes/register.js'
import init from './routes/init.js'
import me from './routes/me.js'
import files from './routes/files.js'
import monitor from './routes/monitor.js'
import projects from './routes/projects.js'

const app = new Hono()

app.use('/*', cors())

app.route('/', health)
app.route('/api', init)
app.route('/api', auth)
app.route('/api', register)
app.route('/api', me)
app.route('/api', files)
app.route('/api', monitor)
app.route('/api', projects)

export default app
