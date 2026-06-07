'use client'

import React, { useState, useEffect } from 'react'
import { Form, Input, Button, message, Card, Space, Statistic, Alert } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { useAuthStore } from '@/store/auth'

const VerifyTwoFAPage = () => {
  const [form] = Form.useForm()
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          message.error('Session expired. Please login again.')
          router.push('/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const onFinish = async (values: any) => {
    try {
      setLoading(true)

      const tempToken = sessionStorage.getItem('tempToken')
      if (!tempToken) {
        message.error('Session expired. Please login again.')
        router.push('/login')
        return
      }

      const response = await api.post(
        '/auth/verify-2fa',
        { code: values.code },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      )

      const { user, token } = response.data

      // Clear temp token and save permanent token
      sessionStorage.removeItem('tempToken')
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)

      message.success('2FA verification successful!')
      router.push('/admin/dashboard')
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || '2FA verification failed'
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Two-Factor Authentication</h1>
          <p className="text-gray-600 mb-4">Enter the 6-digit code from your authenticator app</p>
          <Statistic
            title="Time Remaining"
            value={formatTime(timeLeft)}
            valueStyle={{ color: timeLeft < 60 ? '#cf1322' : '#1890ff' }}
          />
        </div>

        <Alert
          message="Enter the 6-digit code from your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)"
          type="info"
          className="mb-4"
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="code"
            label="Verification Code"
            rules={[
              { required: true, message: 'Please enter the 6-digit code' },
              {
                len: 6,
                message: 'Code must be 6 digits',
              },
              {
                pattern: /^\d{6}$/,
                message: 'Code must contain only numbers',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              placeholder="000000"
              maxLength={6}
              size="large"
              type="number"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Verify
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm text-gray-600 mt-4">
          <p>Need help? Contact support@example.com</p>
        </div>
      </Card>
    </div>
  )
}

export default VerifyTwoFAPage