"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  Button,
  Input,
  Table,
  Tag,
  Space,
  Alert,
  Typography,
  Row,
  Col,
  Avatar,
  Popconfirm,
  message,
  Form,
} from "antd"
import {
  ShareAltOutlined,
  CopyOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  KeyOutlined,
  TeamOutlined,
  ReloadOutlined,
} from "@ant-design/icons"

const { Title, Text, Paragraph } = Typography

const ShareAccount: React.FC = () => {
  const [shareCode, setShareCode] = useState("FIN-2024-ABC123")
  const [loading, setLoading] = useState(false)
  const [sharedUsers] = useState([
    {
      id: 1,
      name: "Maria Silva",
      email: "maria@email.com",
      role: "admin",
      joinedAt: "2023-12-15",
      avatar: "MS",
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao@email.com",
      role: "viewer",
      joinedAt: "2023-12-20",
      avatar: "JS",
    },
  ])

  const generateNewCode = () => {
    setLoading(true)
    setTimeout(() => {
      const newCode = `FIN-2024-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      setShareCode(newCode)
      setLoading(false)
      message.success("Novo código gerado com sucesso!")
    }, 1000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    message.success("Código copiado para a área de transferência!")
  }

  const handleAccessAccount = (values: any) => {
    message.success("Acesso à conta compartilhada realizado com sucesso!")
  }

  const removeUser = (userId: number) => {
    message.success("Usuário removido com sucesso!")
  }

  const columns = [
    {
      title: "Usuário",
      key: "user",
      render: (record: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar style={{ backgroundColor: "#1890ff" }}>{record.avatar}</Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Função",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const roleConfig = {
          admin: { color: "red", text: "Administrador" },
          editor: { color: "blue", text: "Editor" },
          viewer: { color: "green", text: "Visualizador" },
        }
        const config = roleConfig[role as keyof typeof roleConfig]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: "Entrou em",
      dataIndex: "joinedAt",
      key: "joinedAt",
      render: (date: string) => new Date(date).toLocaleDateString("pt-BR"),
    },
    {
      title: "Ações",
      key: "actions",
      render: (record: any) => (
        <Popconfirm
          title="Remover usuário"
          description="Tem certeza que deseja remover este usuário?"
          onConfirm={() => removeUser(record.id)}
          okText="Sim"
          cancelText="Não"
        >
          <Button type="text" danger icon={<UserDeleteOutlined />} disabled={record.role === "admin"} />
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <Title level={2}>Compartilhar Conta</Title>
      <Paragraph>Gerencie o acesso compartilhado às suas finanças</Paragraph>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShareAltOutlined />
                Gerar Código de Compartilhamento
              </div>
            }
            className="financial-card"
          >
            <Alert
              message="Código de Compartilhamento"
              description="Este código permite acesso total à sua conta financeira. Compartilhe apenas com pessoas de confiança."
              type="warning"
              showIcon
              icon={<KeyOutlined />}
              style={{ marginBottom: 16 }}
            />

            <Form.Item label="Código Atual">
              <Input.Group compact>
                <Input value={shareCode} readOnly style={{ width: "calc(100% - 40px)" }} />
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(shareCode)} />
              </Input.Group>
            </Form.Item>

            <Space style={{ width: "100%", marginBottom: 16 }}>
              <Button type="primary" icon={<ReloadOutlined />} loading={loading} onClick={generateNewCode}>
                Gerar Novo Código
              </Button>
              <Button danger>Desativar Código</Button>
            </Space>

            <div style={{ fontSize: 12, color: "#666" }}>
              <p>• O código expira em 7 dias</p>
              <p>• Máximo de 5 pessoas por conta</p>
              <p>• Você pode revogar o acesso a qualquer momento</p>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserAddOutlined />
                Acessar Conta Compartilhada
              </div>
            }
            className="financial-card"
          >
            <Form layout="vertical" onFinish={handleAccessAccount}>
              <Form.Item
                name="accessCode"
                label="Código de Acesso"
                rules={[{ required: true, message: "Código é obrigatório" }]}
              >
                <Input placeholder="FIN-2024-XXXXXX" style={{ fontFamily: "monospace" }} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<UserAddOutlined />}
                  block
                  style={{ background: "#52c41a", borderColor: "#52c41a" }}
                >
                  Acessar Conta
                </Button>
              </Form.Item>
            </Form>

            <Alert
              message="Importante"
              description="Ao inserir um código, você terá acesso às informações financeiras da conta compartilhada. Certifique-se de que tem permissão para isso."
              type="info"
              showIcon
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TeamOutlined />
            Usuários com Acesso
          </div>
        }
        extra={<Text type="secondary">{sharedUsers.length} usuários</Text>}
        className="financial-card"
        style={{ marginTop: 24 }}
      >
        <Table columns={columns} dataSource={sharedUsers} rowKey="id" pagination={false} />
      </Card>
    </div>
  )
}

export default ShareAccount
