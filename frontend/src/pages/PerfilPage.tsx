import { useState } from 'react'
import { 
  Card, 
  Typography, 
  Space, 
  Button, 
  Input, 
  message, 
  Modal, 
  Form, 
  Alert,
  Tooltip
} from 'antd'
import { 
  UserOutlined, 
  ShareAltOutlined, 
  CopyOutlined,
  EditOutlined,
  QrcodeOutlined,
  SendOutlined
} from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from 'react-query'
// import { usersService } from '../services/usersService'
import api from '../services/api'

// Serviço temporário inline para resolver problema de importação
const usersService = {
  async getProfile() {
    const response = await api.get('/users/profile')
    return response.data
  },
  
  async updateProfile(data: any) {
    const response = await api.put('/users/profile', data)
    return response.data
  },

  async connectWithSharingCode(sharingCode: string) {
    const response = await api.post('/users/connect-sharing', { sharing_code: sharingCode })
    return response.data
  },

  async getSharedUsers(sharingCode: string) {
    const response = await api.get(`/users/shared-users/${sharingCode}`)
    return response.data
  }
}

// Serviço para testar notificações do Telegram
const telegramService = {
  async testNotification(message?: string) {
    const response = await api.post('/telegram/test-notification', { message })
    return response.data
  },

  async testExpenseNotifications() {
    const response = await api.post('/telegram/test-expenses')
    return response.data
  },

  async testInvoiceNotifications() {
    const response = await api.post('/telegram/test-invoices')
    return response.data
  }
}

const { Title, Text, Paragraph } = Typography

export default function PerfilPage() {
  const queryClient = useQueryClient()
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isQRModalVisible, setIsQRModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Buscar dados do perfil
  const { data: profile, isLoading } = useQuery(
    'profile',
    () => usersService.getProfile(),
    {
      onError: (error: any) => {
        message.error('Erro ao carregar perfil: ' + (error.response?.data?.message || error.message))
      }
    }
  )

  // Buscar usuários compartilhados
  const { data: sharedUsers } = useQuery(
    ['sharedUsers', profile?.sharing_code],
    () => usersService.getSharedUsers(profile?.sharing_code),
    {
      enabled: !!profile?.sharing_code,
      onError: () => {
        // Ignorar erros silenciosamente, pois pode não existir endpoint ainda
      }
    }
  )

  // Mutation para atualizar perfil
  const updateMutation = useMutation(usersService.updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries('profile')
      message.success('Perfil atualizado com sucesso!')
      setIsEditModalVisible(false)
      form.resetFields()
    },
    onError: (error: any) => {
      message.error('Erro ao atualizar perfil: ' + (error.response?.data?.message || error.message))
    }
  })

  // Mutation para conectar com código de compartilhamento
  const connectMutation = useMutation(usersService.connectWithSharingCode, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('profile')
      queryClient.invalidateQueries(['sharedUsers'])
      message.success(`Conectado com sucesso à conta de ${data.connectedUserName}!`)
      // Limpar o campo de input
      const input = document.getElementById('shared-code-input') as HTMLInputElement;
      if (input) input.value = '';
    },
    onError: (error: any) => {
      message.error('Erro ao conectar: ' + (error.response?.data?.message || error.message))
    }
  })

  // Mutations para testar notificações do Telegram
  const testNotificationMutation = useMutation(telegramService.testNotification, {
    onSuccess: (data) => {
      if (data.success) {
        message.success(data.message)
      } else {
        message.error(data.message)
      }
    },
    onError: (error: any) => {
      message.error('Erro ao testar notificação: ' + (error.response?.data?.message || error.message))
    }
  })

  const testExpensesMutation = useMutation(telegramService.testExpenseNotifications, {
    onSuccess: (data) => {
      message.success(data.message)
    },
    onError: (error: any) => {
      message.error('Erro ao testar notificações de despesas: ' + (error.response?.data?.message || error.message))
    }
  })

  const testInvoicesMutation = useMutation(telegramService.testInvoiceNotifications, {
    onSuccess: (data) => {
      message.success(data.message)
    },
    onError: (error: any) => {
      message.error('Erro ao testar notificações de faturas: ' + (error.response?.data?.message || error.message))
    }
  })

  const handleCopyCode = () => {
    if (profile?.sharing_code) {
      navigator.clipboard.writeText(profile.sharing_code)
      message.success('Código copiado para a área de transferência!')
    }
  }

  const handleEdit = () => {
    form.setFieldsValue({
      name: profile?.name,
      telegram_id: profile?.telegram_id || ''
    })
    setIsEditModalVisible(true)
  }

  const handleSubmit = (values: any) => {
    updateMutation.mutate(values)
  }

  const handleConnectWithCode = (sharingCode: string) => {
    if (!sharingCode.trim()) {
      message.error('Digite um código de compartilhamento')
      return
    }
    
    if (sharingCode === profile?.sharing_code) {
      message.error('Você não pode conectar com seu próprio código')
      return
    }

    connectMutation.mutate(sharingCode.trim())
  }

  const shareUrl = `${window.location.origin}/compartilhar/${profile?.sharing_code}`

  return (
    <div>
      <Title level={2}>
        <UserOutlined /> Meu Perfil
      </Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Card de Informações Pessoais */}
        <Card 
          title="Informações Pessoais" 
          extra={
            <Button icon={<EditOutlined />} onClick={handleEdit}>
              Editar
            </Button>
          }
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>Nome:</Text>
              <div>{profile?.name}</div>
            </div>
            <div>
              <Text strong>Email:</Text>
              <div>{profile?.email}</div>
            </div>
            <div>
              <Text strong>Telegram ID:</Text>
              <div>{profile?.telegram_id || 'Não configurado'}</div>
            </div>
          </Space>
        </Card>

        {/* Card de Compartilhamento */}
        <Card title="Compartilhamento de Finanças">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Alert
              message="Como funciona o compartilhamento bidirecional"
              description="Compartilhe seu código com familiares ou cônjuge para acesso total às finanças. Ambas as pessoas poderão VER, EDITAR e EXCLUIR todas as transações (receitas, despesas e faturas). É um compartilhamento completo e bidirecional - o que você adiciona, a outra pessoa vê, e vice-versa."
              type="info"
              showIcon
            />

            {/* Seção para conectar com código de outra pessoa */}
            <Card 
              title="🔗 Conectar com outra conta" 
              size="small" 
              style={{ backgroundColor: '#f9f9f9' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <Text>
                  Se alguém compartilhou um código com você, insira-o abaixo para sincronizar suas contas:
                </Text>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      placeholder="Cole o código de compartilhamento aqui"
                      style={{ fontFamily: 'monospace' }}
                      id="shared-code-input"
                    />
                    <Button 
                      type="primary"
                      onClick={() => {
                        const input = document.getElementById('shared-code-input') as HTMLInputElement;
                        if (input?.value) {
                          handleConnectWithCode(input.value);
                        }
                      }}
                    >
                      Conectar
                    </Button>
                  </Space.Compact>
                </Form.Item>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Ao conectar, você passará a ver e gerenciar as transações de ambas as contas
                </Text>
              </Space>
            </Card>
            
            <div>
              <Text strong>Seu código de compartilhamento:</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <Input 
                  value={profile?.sharing_code} 
                  readOnly 
                  style={{ fontFamily: 'monospace' }}
                />
                <Tooltip title="Copiar código">
                  <Button icon={<CopyOutlined />} onClick={handleCopyCode} />
                </Tooltip>
                <Tooltip title="Mostrar QR Code">
                  <Button icon={<QrcodeOutlined />} onClick={() => setIsQRModalVisible(true)} />
                </Tooltip>
              </div>
            </div>

            {/* Mostrar contas conectadas */}
            {sharedUsers && sharedUsers.length > 1 && (
              <Card 
                title="👥 Contas Conectadas" 
                size="small" 
                style={{ backgroundColor: '#f0f9ff' }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <Text type="secondary">
                    Vocês compartilham as mesmas transações financeiras:
                  </Text>
                  {sharedUsers.map((user: any, index: number) => (
                    <div key={user.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '8px 12px',
                      backgroundColor: user.id === profile?.id ? '#e6f7ff' : '#fff',
                      borderRadius: '6px',
                      border: '1px solid #d9d9d9'
                    }}>
                      <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                      <div style={{ flex: 1 }}>
                        <Text strong>{user.name}</Text>
                        {user.id === profile?.id && (
                          <Text type="secondary" style={{ marginLeft: 8 }}>(Você)</Text>
                        )}
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {user.email}
                        </Text>
                      </div>
                    </div>
                  ))}
                </Space>
              </Card>
            )}

            <div>
              <Text strong>Link de compartilhamento:</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <Input 
                  value={shareUrl} 
                  readOnly 
                  style={{ fontSize: '12px' }}
                />
                <Tooltip title="Copiar link">
                  <Button 
                    icon={<CopyOutlined />} 
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl)
                      message.success('Link copiado!')
                    }} 
                  />
                </Tooltip>
              </div>
            </div>
          </Space>
        </Card>

        {/* Card de Configurações do Telegram */}
        <Card title="Notificações do Telegram">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Alert
              message="Configure as notificações"
              description={
                <div>
                  <Paragraph>
                    Para receber notificações de vencimentos e lembretes:
                  </Paragraph>
                  <ol>
                    <li>Inicie uma conversa com o bot: <strong>@ControleFinanceiroBot</strong></li>
                    <li>Digite <code>/start</code> para ativar</li>
                    <li>Digite <code>/id</code> para obter seu Telegram ID</li>
                    <li>Adicione o ID aqui no perfil</li>
                  </ol>
                </div>
              }
              type="warning"
              showIcon
            />
            
            <div>
              <Text strong>Status das notificações:</Text>
              <div style={{ marginTop: 8 }}>
                {profile?.telegram_id ? (
                  <Alert 
                    message="Notificações ativadas" 
                    description={`Telegram ID configurado: ${profile.telegram_id}`}
                    type="success" 
                    showIcon 
                  />
                ) : (
                  <Alert 
                    message="Notificações desativadas" 
                    description="Configure seu Telegram ID para receber notificações"
                    type="error" 
                    showIcon 
                  />
                )}
              </div>
            </div>

            <Button 
              type="primary" 
              icon={<SendOutlined />}
              onClick={() => window.open('https://t.me/ControleFinanceiroBot', '_blank')}
            >
              Abrir Bot do Telegram
            </Button>

            {/* Seção de testes (só aparece se Telegram ID estiver configurado) */}
            {profile?.telegram_id && (
              <Card 
                title="🧪 Testar Notificações" 
                size="small" 
                style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <Text type="secondary">
                    Use os botões abaixo para testar se as notificações estão funcionando:
                  </Text>
                  <Space wrap>
                    <Button 
                      size="small"
                      loading={testNotificationMutation.isLoading}
                      onClick={() => testNotificationMutation.mutate(undefined)}
                    >
                      📱 Teste Simples
                    </Button>
                    <Button 
                      size="small"
                      loading={testExpensesMutation.isLoading}
                      onClick={() => testExpensesMutation.mutate(undefined)}
                    >
                      💸 Teste Despesas
                    </Button>
                    <Button 
                      size="small"
                      loading={testInvoicesMutation.isLoading}
                      onClick={() => testInvoicesMutation.mutate(undefined)}
                    >
                      💳 Teste Faturas
                    </Button>
                  </Space>
                  <Alert
                    message="Sobre as notificações automáticas"
                    description="O sistema envia notificações automáticas diariamente às 9h (despesas vencendo) e mensalmente no dia 1º (resumo de faturas). Além disso, você recebe notificações instantâneas ao adicionar receitas, despesas, marcar como pago ou importar faturas."
                    type="info"
                    showIcon
                    style={{ fontSize: '12px' }}
                  />
                </Space>
              </Card>
            )}
          </Space>
        </Card>
      </Space>

      {/* Modal de Edição */}
      <Modal
        title="Editar Perfil"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Digite seu nome' }]}
          >
            <Input placeholder="Seu nome completo" />
          </Form.Item>

          <Form.Item
            name="telegram_id"
            label="Telegram ID"
            extra="Digite /id no bot do Telegram para obter seu ID"
          >
            <Input placeholder="123456789" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={updateMutation.isLoading}
              >
                Salvar
              </Button>
              <Button onClick={() => setIsEditModalVisible(false)}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal do QR Code */}
      <Modal
        title="QR Code para Compartilhamento"
        open={isQRModalVisible}
        onCancel={() => setIsQRModalVisible(false)}
        footer={null}
        width={400}
      >
        <div style={{ textAlign: 'center' }}>
          {profile?.sharing_code && (
            <div style={{ 
              padding: '20px', 
              border: '2px solid #d9d9d9', 
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              margin: '20px 0'
            }}>
              <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                QR Code não disponível
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Use o link de compartilhamento acima
              </div>
            </div>
          )}
          <Text style={{ marginTop: 16 }}>
            Compartilhe o link de compartilhamento para que outras pessoas possam acessar suas finanças
          </Text>
        </div>
      </Modal>
    </div>
  )
}
