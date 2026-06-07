import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/utils/jwt'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Protected routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users away from login
  if (request.nextUrl.pathname === '/login' && token && verifyToken(token)) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/'],
}