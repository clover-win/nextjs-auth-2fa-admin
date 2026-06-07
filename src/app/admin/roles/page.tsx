'use client'

import React, { useEffect, useState } from 'react'
import {
  Layout,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Popconfirm,
  Card,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import api from '@/utils/api'

const { Header, Content, Footer } = Layout

interface Role {
  id: number
  name: string
  description: string
}

const RolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/roles')
      setRoles(response.data)
    } catch (error) {
      message.error('Failed to fetch roles')
    } finally {
      setLoading(false)
    }
  }

  const handleAddRole = () => {
    setEditingRole(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    form.setFieldsValue(role)
    setModalVisible(true)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      if (editingRole) {
        await api.put(`/admin/roles/${editingRole.id}`, values)
        message.success('Role updated successfully')
      } else {
        await api.post('/admin/roles', values)
        message.success('Role created successfully')
      }

      setModalVisible(false)
      fetchRoles()
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRole = async (roleId: number) => {
    try {
      setLoading(true)
      await api.delete(`/admin/roles/${roleId}`)
      message.success('Role deleted successfully')
      fetchRoles()
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete role')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Role) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRole(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Role"
            description="Are you sure you want to delete this role?"
            onConfirm={() => handleDeleteRole(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Layout className="min-h-screen">
      <Header className="bg-blue-600 text-white flex items-center">
        <h1 className="text-2xl font-bold m-0">Role Management</h1>
      </Header>

      <Content className="p-8">
        <Card className="mb-4">
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddRole}
            >
              Create Role
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchRoles}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        </Card>

        <Table
          columns={columns}
          dataSource={roles}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Content>

      <Modal
        title={editingRole ? 'Edit Role' : 'Create Role'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input placeholder="e.g., Admin, User, Moderator" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea
              placeholder="Describe the role"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Footer className="text-center bg-gray-100 border-t">
        Auth 2FA Admin System © 2026. All rights reserved.
      </Footer>
    </Layout>
  )
}

export default RolesPage