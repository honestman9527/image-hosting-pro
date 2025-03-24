import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout, Menu, Typography, ConfigProvider, theme } from 'antd'
import { UploadOutlined, PictureOutlined, HistoryOutlined, SettingOutlined, GithubOutlined } from '@ant-design/icons'
import './App.css'

const { Header, Content, Footer } = Layout
const { Title } = Typography

function App() {
  const location = useLocation()
  const [current, setCurrent] = useState(location.pathname)

  // 菜单项点击处理
  const handleMenuClick = (e) => {
    setCurrent(e.key)
  }

  // 菜单项配置
  const menuItems = [
    {
      key: '/',
      icon: <GithubOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/upload',
      icon: <UploadOutlined />,
      label: <Link to="/upload">上传图片</Link>,
    },
    {
      key: '/images',
      icon: <PictureOutlined />,
      label: <Link to="/images">图片管理</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">设置</Link>,
    },
  ]

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Layout className="app-layout">
        <Header className="app-header">
          <div className="logo-container">
            <Title level={4} className="app-title">GitHub图床</Title>
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[current]}
            onClick={handleMenuClick}
            items={menuItems}
            className="app-menu"
          />
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
        <Footer className="app-footer">
          GitHub图床工具 ©{new Date().getFullYear()} Created with React & Ant Design
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default App
