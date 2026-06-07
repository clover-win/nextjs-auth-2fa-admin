import speakeasy from 'speakeasy'
import { twoFAConfig } from '@/config'

export interface TwoFASecret {
  secret: string
  qrCode: string
}

export const generateTwoFASecret = (email: string): TwoFASecret => {
  const secret = speakeasy.generateSecret({
    name: `${twoFAConfig.appName} (${email})`,
    issuer: twoFAConfig.appName,
    length: 32,
  })

  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url || '',
  }
}

export const verifyTwoFAToken = (secret: string, token: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: twoFAConfig.window,
  })
}

export const generateQRCode = (otpauthUrl: string): string => {
  return otpauthUrl
}