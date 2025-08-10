// Lightweight JWT/localStorage utilities; localStorage is used for simplicity and portability (no cookies or server sessions).

const TOKEN_KEY = 'lms_token'

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function getUserInfo() {
  const token = getToken()
  if (!token) return null
  const payload = parseJwt(token)
  if (!payload) return null
  return {
    id: payload.id,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    exp: payload.exp
  }
}

export function isTokenValid() {
  const token = getToken()
  if (!token) return false
  const payload = parseJwt(token)
  if (!payload || !payload.exp) return false
  const now = Math.floor(Date.now() / 1000)
  return payload.exp > now
}


