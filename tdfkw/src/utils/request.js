const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export function request(url, options = {}) {
  const fullUrl = BASE_URL + url
  console.log('API Request:', fullUrl)
  return fetch(fullUrl, options).then((res) => res.json())
}
