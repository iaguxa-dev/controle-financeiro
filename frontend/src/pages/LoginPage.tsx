"use client"

import type React from "react"
import { useState } from "react"
import { Card, Row, Col, Tabs, Form, Input, Button, Typography, Space } from "antd"
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  DollarOutlined,
  BarChartOutlined,
  TeamOutlined,
} from "@ant-design/icons"
import { useAuth } from "../contexts/AuthContext"

const { Title, Paragraph } = Typography
const { TabPane } = Tabs

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { login, register, recoverPassword } = useAuth()

  const onLogin = async (values: any) => {
    setLoading(true)
    try {
      await login(values.email, values.password)
    } catch (error) {
      console.error("Erro no login:", error)
    } finally {
      setLoading(false)
    }
  }

  const onRegister = async (values: any) => {
    setLoading(true)
    try {
      await register(values.email, values.password, values.fullName)
    } catch (error) {
      console.error("Erro no cadastro:", error)
    } finally {
      setLoading(false)
    }
  }

  const onRecover = async (values: any) => {
    setLoading(true)
    try {
      await recoverPassword(values.email)
    } catch (error) {
      console.error("Erro na recuperação:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card" bodyStyle={{ padding: 0 }}>
        <Row style={{ minHeight: "600px" }}>
          {/* Lado Esquerdo - Informações */}
          <Col xs={24} lg={12} className="login-left">
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Title level={1} style={{ color: "white", marginBottom: 16 }}>
                  Controle Financeiro
                </Title>
                <Paragraph style={{ color: "rgba(255,255,255,0.8)", fontSize: 18 }}>
                  Gerencie suas finanças de forma inteligente e compartilhada
                </Paragraph>
              </div>

              <div>
                <div className="feature-item">
                  <div className="feature-icon" style={{ background: "rgba(255,255,255,0.2)" }}>
                    <DollarOutlined style={{ color: "white" }} />
                  </div>
                  <div>
                    <Title level={4} style={{ color: "white", marginBottom: 4 }}>
                      Receitas e Despesas
                    </Title>
                    <Paragraph style={{ color: "rgba(255,255,255,0.8)", marginBottom: 0 }}>
                      Controle completo do seu fluxo de caixa
                    </Paragraph>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon" style={{ background: "rgba(255,255,255,0.2)" }}>
                    <BarChartOutlined style={{ color: "white" }} />
                  </div>
                  <div>
                    <Title level={4} style={{ color: "white", marginBottom: 4 }}>
                      Dashboard e Relatórios
                    </Title>
                    <Paragraph style={{ color: "rgba(255,255,255,0.8)", marginBottom: 0 }}>
                      Visualize seus dados financeiros em tempo real
                    </Paragraph>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon" style={{ background: "rgba(255,255,255,0.2)" }}>
                    <TeamOutlined style={{ color: "white" }} />
                  </div>
                  <div>
                    <Title level={4} style={{ color: "white", marginBottom: 4 }}>
                      Compartilhamento
                    </Title>
                    <Paragraph style={{ color: "rgba(255,255,255,0.8)", marginBottom: 0 }}>
                      Gerencie finanças em conjunto com outras pessoas
                    </Paragraph>
                  </div>
                </div>
              </div>
            </Space>
          </Col>

          {/* Lado Direito - Formulários */}
          <Col xs={24} lg={12} className="login-right">
            <div style={{ maxWidth: 400, margin: "0 auto" }}>
              <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
                Acesse sua conta
              </Title>

              <Tabs defaultActiveKey="login" centered>
                <TabPane tab="Login" key="login">
                  <Form onFinish={onLogin} layout="vertical" size="large">
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Por favor, insira seu email!" },
                        { type: "email", message: "Email inválido!" },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="seu@email.com" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: "Por favor, insira sua senha!" }]}>
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Sua senha"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} block style={{ height: 48 }}>
                        Entrar
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>

                <TabPane tab="Cadastro" key="register">
                  <Form onFinish={onRegister} layout="vertical" size="large">
                    <Form.Item name="fullName" rules={[{ required: true, message: "Por favor, insira seu nome!" }]}>
                      <Input prefix={<UserOutlined />} placeholder="Seu nome completo" />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Por favor, insira seu email!" },
                        { type: "email", message: "Email inválido!" },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="seu@email.com" />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: "Por favor, insira sua senha!" },
                        { min: 6, message: "Senha deve ter pelo menos 6 caracteres!" },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Crie uma senha"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "Por favor, confirme sua senha!" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve()
                            }
                            return Promise.reject(new Error("As senhas não coincidem!"))
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Confirme sua senha"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        style={{ height: 48, background: "#52c41a", borderColor: "#52c41a" }}
                      >
                        Criar conta
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>

                <TabPane tab="Recuperar" key="recover">
                  <Form onFinish={onRecover} layout="vertical" size="large">
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Por favor, insira seu email!" },
                        { type: "email", message: "Email inválido!" },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="seu@email.com" />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        style={{ height: 48, background: "#fa8c16", borderColor: "#fa8c16" }}
                      >
                        Enviar link de recuperação
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default LoginPage
