import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Toast } from 'antd-mobile'
import { loginApi } from '@/api/auth'
import { useAuthStore } from '@/store/useAuthStore'
import './index.css'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { phone: string; password: string }) => {
    setLoading(true)
    try {
      const res = await loginApi.login(values)
      setAuth(res.data.token, res.data.userDetail)
      Toast.show({
        icon: 'success',
        content: '登录成功'
      })
      navigate('/tasks')
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">EAR Task</h1>
        <p className="login-subtitle">据点辅助工具</p>
        
        <Form
          onFinish={onFinish}
          footer={
            <Button
              block
              type="submit"
              color="primary"
              size="large"
              loading={loading}
            >
              登录
            </Button>
          }
        >
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号" clearable />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input type="password" placeholder="请输入密码" clearable />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
