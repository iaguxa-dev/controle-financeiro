import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  Card, 
  Typography, 
  Space, 
  Spin, 
  Alert, 
  Button,
  Modal,
  Table
} from 'antd'
import { 
  UserOutlined, 
  EyeOutlined,
  DollarOutlined,
  CreditCardOutlined
} from '@ant-design/icons'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import { usersService } from '../services/usersService'
import { dashboardService } from '../services/dashboardService'
import { useBrazilianCurrency } from '../hooks/useBrazilianCurrency'

const { Title, Text, Paragraph } = Typography

export default function CompartilharPage() {
  const { sharingCode } = useParams<{ sharingCode: string }>()
  const { formatCurrency } = useBrazilianCurrency()
  const [isAuthorized, setIsAuthorized] = useState(false)

  // Buscar dados do usuário pelo código de compartilhamento
  const { data: sharedUser, isLoading: userLoading, error: userError } = useQuery(
    ['sharedUser', sharingCode],
    () => usersService.getUserBySharingCode(sharingCode!),
    {
      enabled: !!sharingCode && !isAuthorized,
      retry: false
    }
  )

  // Buscar dados financeiros (apenas se autorizado)
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery(
    ['sharedDashboard', sharedUser?.id],
    () => dashboardService.getDashboardData(),
    {
      enabled: !!sharedUser && isAuthorized,
      onError: (error: any) => {
        console.error('Erro ao carregar dados compartilhados:', error)
      }
    }
  )

  const handleAuthorize = () => {
    if (window.confirm(`Você tem permissão para visualizar as finanças de ${sharedUser?.name}?`)) {
      setIsAuthorized(true)
    }
  }

  if (userLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Carregando informações...</div>
      </div>
    )
  }

  if (userError || !sharedUser) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Alert
          message="Código inválido"
          description="O código de compartilhamento não foi encontrado ou é inválido."
          type="error"
          showIcon
        />
        <Button 
          type="primary" 
          style={{ marginTop: 16 }}
          onClick={() => window.location.href = '/'}
        >
          Voltar ao início
        </Button>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', maxWidth: 600, margin: '0 auto' }}>
        <Card>
          <Space direction="vertical" style={{ width: '100%' }} align="center">
            <UserOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            <Title level={3}>Finanças Compartilhadas</Title>
            <Paragraph>
              Você está prestes a visualizar as informações financeiras de:
            </Paragraph>
            <Title level={4}>{sharedUser.name}</Title>
            <Text type="secondary">{sharedUser.email}</Text>
            
            <Alert
              message="Confidencialidade"
              description="As informações financeiras são confidenciais. Certifique-se de que você tem autorização para visualizar estes dados."
              type="warning"
              showIcon
              style={{ margin: '24px 0' }}
            />
            
            <Button 
              type="primary" 
              size="large"
              icon={<EyeOutlined />}
              onClick={handleAuthorize}
            >
              Visualizar Finanças
            </Button>
          </Space>
        </Card>
      </div>
    )
  }

  if (dashboardLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Carregando dados financeiros...</div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>
          <UserOutlined /> Finanças de {sharedUser.name}
        </Title>
        <Text type="secondary">Visualização compartilhada</Text>
      </div>
      
      <Alert
        message="Modo de visualização"
        description={`Você está visualizando as finanças de ${sharedUser.name}. Estes dados são apenas para consulta.`}
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* Resumo Financeiro */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Saldo do Mês</Text>
              <div style={{ 
                fontSize: 18, 
                fontWeight: 'bold',
                color: (dashboardData?.stats.saldoMes || 0) >= 0 ? '#52c41a' : '#ff4d4f'
              }}>
                {formatCurrency(dashboardData?.stats.saldoMes || 0)}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center' }}>
            <DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Total de Receitas</Text>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}>
                {formatCurrency(dashboardData?.stats.totalReceitas || 0)}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center' }}>
            <CreditCardOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Total de Despesas</Text>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: '#ff4d4f' }}>
                {formatCurrency(dashboardData?.stats.totalDespesas || 0)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Listas de Receitas e Despesas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Últimas Receitas" size="small">
          {dashboardData?.ultimasReceitas?.length ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              {dashboardData.ultimasReceitas.map((receita: any, index: number) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{receita.descricao}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(receita.data_recebimento).format('DD/MM/YYYY')}
                    </Text>
                  </div>
                  <div style={{ color: '#52c41a', fontWeight: 'bold' }}>
                    {formatCurrency(receita.valor)}
                  </div>
                </div>
              ))}
            </Space>
          ) : (
            <Text type="secondary">Nenhuma receita encontrada</Text>
          )}
        </Card>

        <Card title="Próximas Contas" size="small">
          {dashboardData?.proximasContas?.length ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              {dashboardData.proximasContas.map((despesa: any, index: number) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{despesa.descricao}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Vence: {dayjs(despesa.data_vencimento).format('DD/MM/YYYY')}
                    </Text>
                  </div>
                  <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                    {formatCurrency(despesa.valor)}
                  </div>
                </div>
              ))}
            </Space>
          ) : (
            <Text type="secondary">Nenhuma conta encontrada</Text>
          )}
        </Card>
      </div>
    </div>
  )
}
