"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  Tabs,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Table,
  Tag,
  Space,
  Popconfirm,
  Typography,
  Row,
  Col,
  message,
} from "antd"
import { PlusOutlined, DeleteOutlined, EditOutlined, DollarOutlined } from "@ant-design/icons"
import { useFinancial } from "../contexts/FinancialContext"
import dayjs from "dayjs"

const { Title } = Typography
const { TabPane } = Tabs
const { Option } = Select

const TransactionManager: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinancial()

  const incomeCategories = ["Salário", "Freelance", "Investimentos", "Vendas", "Outros"]

  const expenseCategories = [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Saúde",
    "Educação",
    "Lazer",
    "Compras",
    "Contas",
    "Outros",
  ]

  const onFinishIncome = async (values: any) => {
    setLoading(true)
    try {
      await addTransaction({
        ...values,
        type: "income",
        date: values.date.format("YYYY-MM-DD"),
      })
      form.resetFields()
      message.success("Receita adicionada com sucesso!")
    } catch (error) {
      message.error("Erro ao adicionar receita")
    } finally {
      setLoading(false)
    }
  }

  const onFinishExpense = async (values: any) => {
    setLoading(true)
    try {
      await addTransaction({
        ...values,
        type: "expense",
        date: values.date.format("YYYY-MM-DD"),
      })
      form.resetFields()
      message.success("Despesa adicionada com sucesso!")
    } catch (error) {
      message.error("Erro ao adicionar despesa")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id)
      message.success("Transação excluída com sucesso!")
    } catch (error) {
      message.error("Erro ao excluir transação")
    }
  }

  const columns = [
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={type === "income" ? "green" : "red"}>{type === "income" ? "Receita" : "Despesa"}</Tag>
      ),
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Categoria",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Valor",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: any) => (
        <span
          style={{
            color: record.type === "income" ? "#52c41a" : "#ff4d4f",
            fontWeight: 600,
          }}
        >
          {record.type === "income" ? "+" : "-"}R$ {amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          paid: { color: "green", text: "Pago" },
          pending: { color: "orange", text: "Pendente" },
          overdue: { color: "red", text: "Vencido" },
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record: any) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => setEditingTransaction(record)} />
          <Popconfirm
            title="Tem certeza que deseja excluir?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={2}>Receitas e Despesas</Title>

      <Tabs defaultActiveKey="add">
        <TabPane tab="Adicionar Transação" key="add">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <div style={{ color: "#52c41a", display: "flex", alignItems: "center", gap: 8 }}>
                    <DollarOutlined />
                    Nova Receita
                  </div>
                }
                className="financial-card"
              >
                <Form form={form} layout="vertical" onFinish={onFinishIncome}>
                  <Form.Item
                    name="description"
                    label="Descrição"
                    rules={[{ required: true, message: "Descrição é obrigatória" }]}
                  >
                    <Input placeholder="Ex: Salário, Freelance..." />
                  </Form.Item>

                  <Form.Item name="amount" label="Valor" rules={[{ required: true, message: "Valor é obrigatório" }]}>
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="0,00"
                      min={0}
                      precision={2}
                      formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value!.replace(/R\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>

                  <Form.Item
                    name="category"
                    label="Categoria"
                    rules={[{ required: true, message: "Categoria é obrigatória" }]}
                  >
                    <Select placeholder="Selecione uma categoria">
                      {incomeCategories.map((category) => (
                        <Option key={category} value={category}>
                          {category}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item name="date" label="Data" rules={[{ required: true, message: "Data é obrigatória" }]}>
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Selecione a data" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<PlusOutlined />}
                      block
                      style={{ background: "#52c41a", borderColor: "#52c41a" }}
                    >
                      Adicionar Receita
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <div style={{ color: "#ff4d4f", display: "flex", alignItems: "center", gap: 8 }}>
                    <DollarOutlined />
                    Nova Despesa
                  </div>
                }
                className="financial-card"
              >
                <Form layout="vertical" onFinish={onFinishExpense}>
                  <Form.Item
                    name="description"
                    label="Descrição"
                    rules={[{ required: true, message: "Descrição é obrigatória" }]}
                  >
                    <Input placeholder="Ex: Supermercado, Combustível..." />
                  </Form.Item>

                  <Form.Item name="amount" label="Valor" rules={[{ required: true, message: "Valor é obrigatório" }]}>
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="0,00"
                      min={0}
                      precision={2}
                      formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value!.replace(/R\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>

                  <Form.Item
                    name="category"
                    label="Categoria"
                    rules={[{ required: true, message: "Categoria é obrigatória" }]}
                  >
                    <Select placeholder="Selecione uma categoria">
                      {expenseCategories.map((category) => (
                        <Option key={category} value={category}>
                          {category}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item name="status" label="Status" rules={[{ required: true, message: "Status é obrigatório" }]}>
                    <Select placeholder="Status do pagamento">
                      <Option value="paid">Pago</Option>
                      <Option value="pending">Pendente</Option>
                      <Option value="overdue">Vencido</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="date" label="Data" rules={[{ required: true, message: "Data é obrigatória" }]}>
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Selecione a data" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<PlusOutlined />}
                      block
                      style={{ background: "#ff4d4f", borderColor: "#ff4d4f" }}
                    >
                      Adicionar Despesa
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Lista de Transações" key="list">
          <Card title="Transações Recentes" className="financial-card">
            <Table
              columns={columns}
              dataSource={transactions}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} transações`,
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default TransactionManager
