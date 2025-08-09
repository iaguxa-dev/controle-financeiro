import { useState } from 'react'
import { Form, Input, Button, Card, Tabs, message, Typography, Space } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons'
import { useMutation } from 'react-query'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/authStore'

const { Title, Paragraph } = Typography
const { TabPane } = Tabs

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login')
  const { login } = useAuthStore()

  const loginMutation = useMutation(authService.login, {
    onSuccess: (data) => {
      login(data.user, data.access_token)
      message.success('Login realizado com sucesso!')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erro ao fazer login')
    },
  })

  const registerMutation = useMutation(authService.register, {
    onSuccess: (data) => {
      login(data.user, data.access_token)
      message.success('Conta criada com sucesso!')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erro ao criar conta')
    },
  })

  const recoverMutation = useMutation(authService.recoverPassword, {
    onSuccess: () => {
      message.success('Email de recuperação enviado!')
      setActiveTab('login')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erro ao enviar email')
    },
  })

  const onLogin = (values: any) => {
    loginMutation.mutate(values)
  }

  const onRegister = (values: any) => {
    registerMutation.mutate(values)
  }

  const onRecover = (values: any) => {
    recoverMutation.mutate(values)
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <Space direction="vertical" size="large" style={{ textAlign: 'center' }}>
          <div>
            <Title level={1} style={{ color: 'white', marginBottom: 0 }}>
              💰 Controle Financeiro
            </Title>
            <Title level={3} style={{ color: 'white', fontWeight: 300 }}>
              Compartilhado
            </Title>
          </div>
          
          <div>
            <Paragraph style={{ color: 'white', fontSize: '18px', marginBottom: '24px' }}>
              Gerencie suas finanças de forma inteligente e compartilhada
            </Paragraph>
            
            <Space direction="vertical" size="middle" style={{ textAlign: 'left' }}>
              <div>✅ Dashboard completo com visão geral</div>
              <div>✅ Controle de receitas e despesas</div>
              <div>✅ Importação de faturas de cartão</div>
              <div>✅ Simulador de vale-transporte</div>
              <div>✅ Compartilhamento entre usuários</div>
              <div>✅ Notificações via Telegram</div>
            </Space>
          </div>
        </Space>
      </div>

      <div className="login-right">
        <Card className="login-form" bordered={false}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
            <TabPane tab="Entrar" key="login">
              <Form onFinish={onLogin} layout="vertical" size="large">
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Digite seu email' },
                    { type: 'email', message: 'Email inválido' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="Email" 
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Digite sua senha' }]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="Senha" 
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    loading={loginMutation.isLoading}
                  >
                    Entrar
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                  <Button 
                    type="link" 
                    onClick={() => setActiveTab('recover')}
                  >
                    Esqueci minha senha
                  </Button>
                </div>
              </Form>
            </TabPane>

            <TabPane tab="Criar Conta" key="register">
              <Form onFinish={onRegister} layout="vertical" size="large">
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Digite seu nome' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Nome completo" 
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Digite seu email' },
                    { type: 'email', message: 'Email inválido' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="Email" 
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Digite sua senha' },
                    { min: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="Senha" 
                  />
                </Form.Item>

                <Form.Item name="telegram_id">
                  <Input 
                    prefix={<MessageOutlined />} 
                    placeholder="ID do Telegram (opcional)" 
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    loading={registerMutation.isLoading}
                  >
                    Criar Conta
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="Recuperar Senha" key="recover">
              <Form onFinish={onRecover} layout="vertical" size="large">
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Digite seu email' },
                    { type: 'email', message: 'Email inválido' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="Email" 
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    loading={recoverMutation.isLoading}
                  >
                    Enviar Email de Recuperação
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                  <Button 
                    type="link" 
                    onClick={() => setActiveTab('login')}
                  >
                    Voltar ao login
                  </Button>
                </div>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
