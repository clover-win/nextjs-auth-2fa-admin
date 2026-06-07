'use client'

import React, { useEffect, useState } from 'react'
import { Layout, Card, Row, Col, Statistic, Button, Space, message, Modal } from 'antd'
import { LogoutOutlined, UserAddOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { useAuthStore } from '@/store/auth'

const { Header, Content, Footer } = Layout

const DashboardPage = () => {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    twoFAEnabled: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/dashboard')
      setStats(response.data)
    } catch (error) {
      message.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Modal.confirm({
      title: 'Logout',
      content: 'Are you sure you want to logout?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        localStorage.removeItem('token')
        logout()
        router.push('/login')
      },
    })
  }

  return (
    <Layout className="min-h-screen">
      <Header className="bg-blue-600 text-white flex items-center justify-between">
        <div className="text-2xl font-bold">Auth 2FA Admin</div>
        <Space>
          <span>Welcome, {user?.display_name || 'Admin'}</span>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      </Header>

      <Content className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to the admin dashboard</p>
        </div>

        <Row gutter={16} className="mb-8">
          <Col xs={24} sm={12} lg={8}>
            <Card loading={loading}>
              <Statistic
                title="Total Users"
                value={stats.totalUsers}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card loading={loading}>
              <Statistic
                title="Active Users"
                value={stats.activeUsers}
                valueStyle={{ color: '#52c41a' }}
                prefix={<UserAddOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card loading={loading}>
              <Statistic
                title="2FA Enabled"
                value={stats.twoFAEnabled}
                valueStyle={{ color: '#1890ff' }}
                prefix={<LockOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Quick Actions" className="mb-8">
          <Space>
            <Button
              type="primary"
              size="large"
              onClick={() => router.push('/admin/users')}
            >
              Manage Users
            </Button>
            <Button
              size="large"
              onClick={() => router.push('/admin/roles')}
            >
              Manage Roles
            </Button>
            <Button
              size="large"
              onClick={() => router.push('/admin/settings')}
            >
              Settings
            </Button>
          </Space>
        </Card>
      </Content>

      <Footer className="text-center bg-gray-100 border-t">
        Auth 2FA Admin System © 2026. All rights reserved.
      </Footer>
    </Layout>
  )
}

export default DashboardPage