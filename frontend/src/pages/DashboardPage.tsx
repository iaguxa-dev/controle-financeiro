"use client"

import type React from "react"
import { useState } from "react"
import { Layout, Menu, Button, Avatar, Dropdown, Badge } from "antd"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import {
  DashboardOutlined,
  PlusCircleOutlined,
  UploadOutlined,
  FileTextOutlined,
  TeamOutlined,
  CarOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { useAuth } from "../contexts/AuthContext"
import DashboardOverview from "../components/DashboardOverview"
import TransactionManager from "../components/TransactionManager"
import ImportInvoices from "../components/ImportInvoices"
import Reports from "../components/Reports"
import ShareAccount from "../components/ShareAccount"
import TransportCalculator from "../components/TransportCalculator"

const { Header, Sider, Content } = Layout

const DashboardPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/dashboard/transactions",
      icon: <PlusCircleOutlined />,
      label: "Receitas/Despesas",
    },
    {
      key: "/dashboard/import",
      icon: <UploadOutlined />,
      label: "Importar Faturas",
    },
    {
      key: "/dashboard/reports",
      icon: <FileTextOutlined />,
      label: "Relatórios",
    },
    {
      key: "/dashboard/share",
      icon: <TeamOutlined />,
      label: "Compartilhar",
    },
    {
      key: "/dashboard/transport",
      icon: <CarOutlined />,
      label: "Vale Transporte",
    },
  ]

  const userMenuItems = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Configurações",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sair",
      onClick: logout,
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
    setMobileMenuVisible(false)
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={window.innerWidth < 768 ? 0 : 80}
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true)
          }
        }}
        style={{
          position: window.innerWidth < 768 ? "fixed" : "relative",
          height: "100vh",
          zIndex: 999,
          left: window.innerWidth < 768 && !mobileMenuVisible ? -200 : 0,
          transition: "left 0.3s ease",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
            background: "white",
          }}
        >
          <h2
            style={{
              color: "#1890ff",
              margin: 0,
              fontSize: collapsed ? 16 : 20,
              fontWeight: 700,
            }}
          >
            {collapsed ? "FC" : "FinanceControl"}
          </h2>
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "white",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileMenuVisible(!mobileMenuVisible)
                } else {
                  setCollapsed(!collapsed)
                }
              }}
              style={{ marginRight: 16 }}
            />
            <h3 style={{ margin: 0, color: "#262626" }}>Controle Financeiro</h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Badge count={3}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: 6,
                  transition: "background 0.3s",
                }}
              >
                <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
                <span style={{ display: window.innerWidth < 768 ? "none" : "inline" }}>
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: "white",
            borderRadius: 8,
            minHeight: "calc(100vh - 112px)",
          }}
        >
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/transactions" element={<TransactionManager />} />
            <Route path="/import" element={<ImportInvoices />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/share" element={<ShareAccount />} />
            <Route path="/transport" element={<TransportCalculator />} />
          </Routes>
        </Content>
      </Layout>

      {/* Mobile Menu Overlay */}
      {window.innerWidth < 768 && mobileMenuVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 998,
          }}
          onClick={() => setMobileMenuVisible(false)}
        />
      )}
    </Layout>
  )
}

export default DashboardPage
