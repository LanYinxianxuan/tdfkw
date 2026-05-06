export function success(c, data, status = 200) {
  return c.json({ success: true, data }, status)
}

export function error(c, message, status = 400) {
  return c.json({ success: false, error: message }, status)
}
