import jwt from 'jsonwebtoken'
import { jwtConfig } from '@/config'

export interface JWTPayload {
  userId: number
  email: string
  roleId?: number
  iat?: number
  exp?: number
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })
}

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}