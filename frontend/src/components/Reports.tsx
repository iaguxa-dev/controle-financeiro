"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  Form,
  Select,
  DatePicker,
  Button,
  Table,
  Tag,
  Row,
  Col,
  Statistic,
  Progress,
  Typography,
  message,
} from "antd"
import {
  FileTextOutlined,
  DownloadOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
  PieChartOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

const Reports: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [reports] = useState([
    {
      id: 1,
      name: "Relatório Mensal - Janeiro 2024",
      type: "Mensal",
      period: "01/2024",
      createdAt: "2024-01-05",
      status: "Gerado",
    },
    {
      id: 2,
      name: "Relatório por Categoria - Q4 2023",
      type: "Categoria",
      period: "Q4/2023",
      createdAt: "2024-01-02",
      status: "Gerado",
    },
  ])

  const summaryData = {
    totalReceitas: 8500.0,
    totalDespesas: 2652.68,
    saldoFinal: 5847.32,
    maiorReceita: { desc: "Salário", valor: 5000.0 },
    maiorDespesa: { desc: "Aluguel", valor: 1200.0 },
    categorias: [
      { nome: "Alimentação", valor: 587.45, percentual: 22.1 },
      { nome: "Transporte", valor: 320.0, percentual: 12.1 },
      { nome: "Moradia", valor: 1200.0, percentual: 45.2 },
      { nome: "Lazer", valor: 245.23, percentual: 9.2 },
      { nome: "Outros", valor: 300.0, percentual: 11.4 },
    ],
  }

  const generateReport = async (values: any) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      message.success("Relatório gerado com sucesso!")
      form.resetFields()
    } catch (error) {
      message.error("Erro ao gerar relatório")
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = (reportId: number) => {
    message.success("Download do relatório iniciado!")
  }

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FileTextOutlined style={{ color: "#1890ff" }} />
          <Text>{name}</Text>
        </div>
      ),
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Período",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "Criado em",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color="green">{status}</Tag>,
    },
    {
      title: "Ações",
      key: "actions",
      render: (record: any) => (
        <Button type="primary" size="small" icon={<DownloadOutlined />} onClick={() => downloadReport(record.id)}>
          Download
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Title level={2}>Relatórios</Title>
      <Text type="secondary">Gere e visualize relatórios detalhados das suas finanças</Text>

      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileTextOutlined />
            Gerar Novo Relatório
          </div>
        }
        className="financial-card"
        style={{ margin: "24px 0" }}
      >
        <Form form={form} layout="vertical" onFinish={generateReport}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="type"
                label="Tipo de Relatório"
                rules={[{ required: true, message: "Selecione o tipo" }]}
              >
                <Select placeholder="Selecione o tipo">
                  <Option value="mensal">Relatório Mensal</Option>
                  <Option value="categoria">Por Categoria</Option>
                  <Option value="comparativo">Comparativo</Option>
                  <Option value="fluxo">Fluxo de Caixa</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="dateRange" label="Período" rules={[{ required: true, message: "Selecione o período" }]}>
                <RangePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label=" ">
                <Button type="primary" htmlType="submit" loading={loading} icon={<FileTextOutlined />} block>
                  Gerar Relatório
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Resumo Financeiro */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="financial-card">
            <Statistic
              title="Total Receitas"
              value={summaryData.totalReceitas}
              precision={2}
              prefix="R$"
              valueStyle={{ color: "#3f8600" }}
              suffix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="financial-card">
            <Statistic
              title="Total Despesas"
              value={summaryData.totalDespesas}
              precision={2}
              prefix="R$"
              valueStyle={{ color: "#cf1322" }}
              suffix={<FallOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="financial-card">
            <Statistic
              title="Saldo Final"
              value={summaryData.saldoFinal}
              precision={2}
              prefix="R$"
              valueStyle={{ color: "#1890ff" }}
              suffix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="financial-card">
            <Statistic
              title="Maior Despesa"
              value={summaryData.maiorDespesa.valor}
              precision={2}
              prefix="R$"
              valueStyle={{ color: "#fa8c16" }}
              suffix={<PieChartOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {summaryData.maiorDespesa.desc}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Gastos por Categoria */}
      <Card title="Gastos por Categoria" className="financial-card" style={{ marginBottom: 24 }}>
        {summaryData.categorias.map((categoria, index) => (
          <div key={index} style={{ marginBottom: 16 }}>
            <Row justify="space-between" style={{ marginBottom: 4 }}>
              <Text>{categoria.nome}</Text>
              <Text strong>
                R$ {categoria.valor.toFixed(2)} ({categoria.percentual}%)
              </Text>
            </Row>
            <Progress percent={categoria.percentual} strokeColor={`hsl(${index * 60}, 70%, 50%)`} showInfo={false} />
          </div>
        ))}
      </Card>

      {/* Lista de Relatórios */}
      <Card title="Relatórios Gerados" className="financial-card">
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} relatórios`,
          }}
        />
      </Card>
    </div>
  )
}

export default Reports
