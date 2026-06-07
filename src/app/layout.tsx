import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-app'
import './globals.css'

export const metadata: Metadata = {
  title: 'Auth 2FA Admin System',
  description: 'Secure authentication with two-factor authentication and role-based access control',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )
}