import { Row, Col, Card, Statistic, Typography, Space, Alert, List, Tag, Spin } from 'antd'
import { 
  DollarOutlined, 
  CreditCardOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import { dashboardService } from '../services/dashboardService'
import { useBrazilianCurrency } from '../hooks/useBrazilianCurrency'

const { Title } = Typography

export default function DashboardPage() {
  const { formatCurrency } = useBrazilianCurrency()
  
  // Buscar dados do dashboard da API
  const { data: dashboardData, isLoading, error } = useQuery(
    'dashboard',
    () => dashboardService.getDashboardData(),
    {
      refetchInterval: 30000, // Refetch a cada 30 segundos
      onError: (error: any) => {
        console.error('Erro ao carregar dados do dashboard:', error)
      }
    }
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'green'
      case 'vencido': return 'red'
      default: return 'orange'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pago': return 'Pago'
      case 'vencido': return 'Vencido'
      default: return 'Pendente'
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Carregando dados do dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '50px' }}>
        <Alert
          message="Erro ao carregar dashboard"
          description="Não foi possível carregar os dados do dashboard. Tente novamente mais tarde."
          type="error"
          showIcon
        />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div style={{ padding: '50px' }}>
        <Alert
          message="Nenhum dado encontrado"
          description="Não há dados disponíveis para exibir no dashboard."
          type="warning"
          showIcon
        />
      </div>
    )
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      <Alert
        message="Bem-vindo ao seu controle financeiro!"
        description="Aqui você tem uma visão geral das suas finanças do mês atual."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <div className="dashboard-stats">
        <Card>
          <Statistic
            title="Saldo do Mês"
            value={formatCurrency(dashboardData?.stats.saldoMes || 0)}
            valueStyle={{ color: (dashboardData?.stats.saldoMes || 0) >= 0 ? '#3f8600' : '#cf1322' }}
          />
        </Card>

        <Card>
          <Statistic
            title="Total de Receitas"
            value={formatCurrency(dashboardData?.stats.totalReceitas || 0)}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>

        <Card>
          <Statistic
            title="Total de Despesas"
            value={formatCurrency(dashboardData?.stats.totalDespesas || 0)}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>

        <Card>
          <Statistic
            title="Contas Pagas"
            value={dashboardData?.stats.contasPagas || 0}
            valueStyle={{ color: '#3f8600' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>

        <Card>
          <Statistic
            title="Contas a Pagar"
            value={dashboardData?.stats.contasAPagar || 0}
            valueStyle={{ color: '#faad14' }}
            prefix={<ClockCircleOutlined />}
          />
        </Card>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Últimas Receitas" className="dashboard-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              {dashboardData?.ultimasReceitas?.length ? (
                <List
                  dataSource={dashboardData.ultimasReceitas}
                  renderItem={(receita) => (
                    <List.Item>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>{receita.descricao}</strong>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {dayjs(receita.data_recebimento).format('DD/MM/YYYY')} • {receita.categoria}
                            </div>
                          </div>
                          <div style={{ color: '#52c41a', fontWeight: 'bold' }}>
                            {formatCurrency(receita.valor)}
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  Nenhuma receita cadastrada ainda
                </div>
              )}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Próximas Contas" className="dashboard-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              {dashboardData?.proximasContas?.length ? (
                <List
                  dataSource={dashboardData.proximasContas}
                  renderItem={(despesa) => (
                    <List.Item>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>{despesa.descricao}</strong>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {dayjs(despesa.data_vencimento).format('DD/MM/YYYY')} • {despesa.categoria}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Tag color={getStatusColor(despesa.status)}>
                              {getStatusText(despesa.status)}
                            </Tag>
                            <div style={{ color: '#f5222d', fontWeight: 'bold' }}>
                              {formatCurrency(despesa.valor)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  Nenhuma conta a pagar cadastrada ainda
                </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
