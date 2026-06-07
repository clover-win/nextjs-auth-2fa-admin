'use client'

import React, { useState } from 'react'
import { Form, Input, Button, message, Card, Space, Alert } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { useAuthStore } from '@/store/auth'
import { validatePassword } from '@/utils/password'

const LoginPage = () => {
  const [form] = Form.useForm()
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      setPasswordError('')

      const response = await api.post('/auth/login', {
        email: values.email,
        password: values.password,
      })

      const { user, token, requiresTwoFA } = response.data

      if (requiresTwoFA) {
        // Redirect to 2FA verification
        sessionStorage.setItem('tempToken', token)
        router.push('/auth/verify-2fa')
        return
      }

      // Save token and user
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)

      message.success('Login successful!')
      router.push('/admin/dashboard')
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Login failed'
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const validatePasswordField = (_: any, value: string) => {
    if (!value) {
      return Promise.resolve()
    }
    if (!validatePassword(value)) {
      setPasswordError(
        'Password must be at least 8 characters with 1 uppercase letter and 1 number'
      )
      return Promise.reject()
    }
    setPasswordError('')
    return Promise.resolve()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Auth 2FA</h1>
          <p className="text-gray-600">Secure Login with Two-Factor Authentication</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { validator: validatePasswordField },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          {passwordError && <Alert message={passwordError} type="error" className="mb-4" />}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage