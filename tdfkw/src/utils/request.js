const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function request(url, options = {}) {
  const fullUrl = BASE_URL + url
  const token = localStorage.getItem('token')

  const headers = { ...options.headers }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  console.log('API Request:', fullUrl)
  const res = await fetch(fullUrl, { ...options, headers })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}
