import { useState, useEffect } from 'react'
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  InputNumber, 
  Select, 
  Space, 
  Typography, 
  Popconfirm,
  message,
  Tag,
  Card,
  Statistic,
  Row,
  Col,
  Spin
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import dayjs from 'dayjs'
import { despesasService, Despesa, CreateDespesaData } from '../services/despesasService'
import { useBrazilianCurrency } from '../hooks/useBrazilianCurrency'
import { CurrencyInput } from '../components/CurrencyInput'

const { Title } = Typography
const { Option } = Select

export default function DespesasPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingDespesa, setEditingDespesa] = useState<Despesa | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { formatCurrency } = useBrazilianCurrency()

  // Buscar despesas da API
  const { data: despesas = [], isLoading, refetch } = useQuery(
    'despesas',
    () => despesasService.getAll(),
    {
      onError: (error: any) => {
        console.error('Erro ao carregar despesas:', error)
        message.error('Erro ao carregar despesas')
      }
    }
  )

  // Mutação para criar despesa
  const createMutation = useMutation(despesasService.create, {
    onSuccess: () => {
      message.success('Despesa criada com sucesso!')
      queryClient.invalidateQueries('despesas')
      queryClient.invalidateQueries('dashboard')
      setIsModalVisible(false)
      form.resetFields()
    },
    onError: (error: any) => {
      console.error('Erro ao criar despesa:', error)
      message.error('Erro ao criar despesa')
    }
  })

  // Mutação para atualizar despesa
  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<CreateDespesaData> }) => 
      despesasService.update(id, data),
    {
      onSuccess: () => {
        message.success('Despesa atualizada com sucesso!')
        queryClient.invalidateQueries('despesas')
        queryClient.invalidateQueries('dashboard')
        setIsModalVisible(false)
        setEditingDespesa(null)
        form.resetFields()
      },
      onError: (error: any) => {
        console.error('Erro ao atualizar despesa:', error)
        message.error('Erro ao atualizar despesa')
      }
    }
  )

  // Mutação para deletar despesa
  const deleteMutation = useMutation(despesasService.delete, {
    onSuccess: () => {
      message.success('Despesa excluída com sucesso!')
      queryClient.invalidateQueries('despesas')
      queryClient.invalidateQueries('dashboard')
    },
    onError: (error: any) => {
      console.error('Erro ao deletar despesa:', error)
      message.error('Erro ao deletar despesa')
    }
  })

  // Calcular totais
  const totalGeral = despesas.reduce((sum, despesa) => sum + despesa.valor, 0)
  const totalPendentes = despesas
    .filter(despesa => despesa.status === 'pendente')
    .reduce((sum, despesa) => sum + despesa.valor, 0)

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleEdit = (despesa: Despesa) => {
    setEditingDespesa(despesa)
    form.setFieldsValue({
      ...despesa,
      data_vencimento: dayjs(despesa.data_vencimento),
      data_pagamento: despesa.data_pagamento ? dayjs(despesa.data_pagamento) : null
    })
    setIsModalVisible(true)
  }

  const handleMarkAsPaid = (despesa: Despesa) => {
    updateMutation.mutate({
      id: despesa.id,
      data: {
        status: 'pago',
        data_pagamento: new Date().toISOString().split('T')[0]
      }
    })
  }

  const handleSubmit = (values: any) => {
    const despesaData: CreateDespesaData = {
      ...values,
      data_vencimento: values.data_vencimento.format('YYYY-MM-DD'),
      data_pagamento: values.data_pagamento ? values.data_pagamento.format('YYYY-MM-DD') : undefined
    }

    if (editingDespesa) {
      updateMutation.mutate({ id: editingDespesa.id, data: despesaData })
    } else {
      createMutation.mutate(despesaData)
    }
  }

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

  const columns = [
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      render: (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}`,
    },
    {
      title: 'Vencimento',
      dataIndex: 'data_vencimento',
      key: 'data_vencimento',
      render: (data: string) => dayjs(data).format('DD/MM/YYYY'),
    },
    {
      title: 'Categoria',
      dataIndex: 'categoria',
      key: 'categoria',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Despesa) => (
        <Space>
          {record.status === 'pendente' && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => handleMarkAsPaid(record)}
            >
              Marcar como Pago
            </Button>
          )}
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir esta despesa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]



  const totalDespesas = despesas.reduce((sum, despesa) => sum + despesa.valor, 0)
  const despesasPendentes = despesas.filter(d => d.status === 'pendente')
  const totalPendente = despesasPendentes.reduce((sum, despesa) => sum + despesa.valor, 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Despesas</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingDespesa(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Nova Despesa
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ padding: 16, background: '#fff2e8', borderRadius: 6 }}>
          <Title level={4} style={{ color: '#fa8c16', margin: 0 }}>
            Total de Despesas: R$ {totalDespesas.toFixed(2).replace('.', ',')}
          </Title>
        </div>
        <div style={{ padding: 16, background: '#fff1f0', borderRadius: 6 }}>
          <Title level={4} style={{ color: '#f5222d', margin: 0 }}>
            Pendentes: R$ {totalPendente.toFixed(2).replace('.', ',')}
          </Title>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={despesas}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingDespesa ? 'Editar Despesa' : 'Nova Despesa'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="descricao"
            label="Descrição"
            rules={[{ required: true, message: 'Digite a descrição' }]}
          >
            <Input placeholder="Ex: Aluguel, Internet, etc." />
          </Form.Item>

          <Form.Item
            name="valor"
            label="Valor"
            rules={[{ required: true, message: 'Digite o valor' }]}
          >
            <CurrencyInput
              placeholder="R$ 0,00"
              value={form.getFieldValue('valor')}
              onChange={(value) => {
                form.setFieldValue('valor', value)
              }}
            />
          </Form.Item>

          <Form.Item
            name="data_vencimento"
            label="Data de Vencimento"
            rules={[{ required: true, message: 'Selecione a data' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="data_pagamento"
            label="Data de Pagamento"
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="categoria"
            label="Categoria"
            rules={[{ required: true, message: 'Selecione a categoria' }]}
          >
            <Select placeholder="Selecione uma categoria">
              <Option value="Moradia">Moradia</Option>
              <Option value="Alimentação">Alimentação</Option>
              <Option value="Transporte">Transporte</Option>
              <Option value="Utilidades">Utilidades</Option>
              <Option value="Saúde">Saúde</Option>
              <Option value="Educação">Educação</Option>
              <Option value="Lazer">Lazer</Option>
              <Option value="Outros">Outros</Option>
            </Select>
          </Form.Item>

          <Form.Item name="observacoes" label="Observações">
            <Input.TextArea rows={3} placeholder="Observações adicionais..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingDespesa ? 'Atualizar' : 'Adicionar'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
