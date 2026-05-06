import { SignJWT, jwtVerify } from 'jose'

function getSecret(c) {
  const secret = c.env.JWT_SECRET || 'tdfkw-dev-secret-change-in-production'
  return new TextEncoder().encode(secret)
}

export async function signToken(c, payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret(c))
}

export async function verifyToken(c, token) {
  try {
    const { payload } = await jwtVerify(token, getSecret(c))
    return payload
  } catch {
    return null
  }
}
