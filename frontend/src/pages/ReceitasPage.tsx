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
  Card,
  Statistic,
  Row,
  Col,
  Spin
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import dayjs from 'dayjs'
import { receitasService, Receita, CreateReceitaData } from '../services/receitasService'
import { useBrazilianCurrency } from '../hooks/useBrazilianCurrency'
import { CurrencyInput } from '../components/CurrencyInput'

const { Title } = Typography
const { Option } = Select

export default function ReceitasPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingReceita, setEditingReceita] = useState<Receita | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { formatCurrency } = useBrazilianCurrency()

  // Buscar receitas da API
  const { data: receitas = [], isLoading, refetch } = useQuery(
    'receitas',
    () => receitasService.getAll(),
    {
      onError: (error: any) => {
        console.error('Erro ao carregar receitas:', error)
        message.error('Erro ao carregar receitas')
      }
    }
  )

  // Mutação para criar receita
  const createMutation = useMutation(receitasService.create, {
    onSuccess: () => {
      message.success('Receita criada com sucesso!')
      queryClient.invalidateQueries('receitas')
      queryClient.invalidateQueries('dashboard')
      setIsModalVisible(false)
      form.resetFields()
    },
    onError: (error: any) => {
      console.error('Erro ao criar receita:', error)
      message.error('Erro ao criar receita')
    }
  })

  // Mutação para atualizar receita
  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<CreateReceitaData> }) => 
      receitasService.update(id, data),
    {
      onSuccess: () => {
        message.success('Receita atualizada com sucesso!')
        queryClient.invalidateQueries('receitas')
        queryClient.invalidateQueries('dashboard')
        setIsModalVisible(false)
        setEditingReceita(null)
        form.resetFields()
      },
      onError: (error: any) => {
        console.error('Erro ao atualizar receita:', error)
        message.error('Erro ao atualizar receita')
      }
    }
  )

  // Mutação para deletar receita
  const deleteMutation = useMutation(receitasService.delete, {
    onSuccess: () => {
      message.success('Receita excluída com sucesso!')
      queryClient.invalidateQueries('receitas')
      queryClient.invalidateQueries('dashboard')
    },
    onError: (error: any) => {
      console.error('Erro ao deletar receita:', error)
      message.error('Erro ao deletar receita')
    }
  })

  // Calcular total
  const totalReceitas = receitas.reduce((sum, receita) => sum + receita.valor, 0)

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleEdit = (receita: Receita) => {
    setEditingReceita(receita)
    form.setFieldsValue({
      ...receita,
      data_recebimento: dayjs(receita.data_recebimento)
    })
    setIsModalVisible(true)
  }

  const handleSubmit = (values: any) => {
    const receitaData: CreateReceitaData = {
      ...values,
      data_recebimento: values.data_recebimento.format('YYYY-MM-DD')
    }

    if (editingReceita) {
      updateMutation.mutate({ id: editingReceita.id, data: receitaData })
    } else {
      createMutation.mutate(receitaData)
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
      title: 'Data',
      dataIndex: 'data_recebimento',
      key: 'data_recebimento',
      render: (data: string) => dayjs(data).format('DD/MM/YYYY'),
    },
    {
      title: 'Categoria',
      dataIndex: 'categoria',
      key: 'categoria',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Receita) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir esta receita?"
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



  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Receitas</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingReceita(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Nova Receita
        </Button>
      </div>

      <div style={{ marginBottom: 16, padding: 16, background: '#f6ffed', borderRadius: 6 }}>
        <Title level={4} style={{ color: '#52c41a', margin: 0 }}>
          Total de Receitas: R$ {totalReceitas.toFixed(2).replace('.', ',')}
        </Title>
      </div>

      <Table
        columns={columns}
        dataSource={receitas}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingReceita ? 'Editar Receita' : 'Nova Receita'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
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
            <Input placeholder="Ex: Salário, Freelance, etc." />
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
            name="data_recebimento"
            label="Data de Recebimento"
            rules={[{ required: true, message: 'Selecione a data' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="categoria"
            label="Categoria"
            rules={[{ required: true, message: 'Selecione a categoria' }]}
          >
            <Select placeholder="Selecione uma categoria">
              <Option value="Trabalho">Trabalho</Option>
              <Option value="Investimentos">Investimentos</Option>
              <Option value="Vendas">Vendas</Option>
              <Option value="Outros">Outros</Option>
            </Select>
          </Form.Item>

          <Form.Item name="observacoes" label="Observações">
            <Input.TextArea rows={3} placeholder="Observações adicionais..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingReceita ? 'Atualizar' : 'Adicionar'}
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
