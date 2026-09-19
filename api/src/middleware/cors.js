import { cors } from 'hono/cors'

export function corsMiddleware() {
  return cors()
}
