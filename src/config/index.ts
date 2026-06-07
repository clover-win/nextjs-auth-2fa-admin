// Database configuration
export const dbConfig = {
  host: process.env.NEXT_PUBLIC_DB_HOST || 'localhost',
  user: process.env.NEXT_PUBLIC_DB_USER || 'root',
  password: process.env.NEXT_PUBLIC_DB_PASSWORD || '',
  database: process.env.NEXT_PUBLIC_DB_NAME || 'auth_db',
  port: parseInt(process.env.NEXT_PUBLIC_DB_PORT || '3306'),
}

// JWT configuration
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: '24h',
}

// 2FA configuration
export const twoFAConfig = {
  appName: 'Auth2FA Admin',
  window: 2,
}