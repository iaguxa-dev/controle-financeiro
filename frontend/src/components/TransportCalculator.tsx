"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  Table,
  Tag,
  Alert,
  Typography,
  Row,
  Col,
  Statistic,
  message,
} from "antd"
import { CarOutlined, CalculatorOutlined, CalendarOutlined, PlusOutlined, InfoCircleOutlined } from "@ant-design/icons"

const { Title, Text } = Typography
const { Option } = Select

const TransportCalculator: React.FC = () => {
  const [form] = Form.useForm()
  const [calculation, setCalculation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [calculationsHistory] = useState([
    {
      id: 1,
      month: "Janeiro 2024",
      workingDays: 22,
      dailyValue: 8.5,
      totalValue: 187.0,
      status: "Calculado",
      createdAt: "2024-01-05",
    },
    {
      id: 2,
      month: "Dezembro 2023",
      workingDays: 21,
      dailyValue: 8.0,
      totalValue: 168.0,
      status: "Adicionado",
      createdAt: "2023-12-01",
    },
  ])

  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  const calculateWorkingDays = (month: number, year: number) => {
    const daysInMonth = new Date(year, month, 0).getDate()
    let workingDays = 0

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dayOfWeek = date.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++
      }
    }

    return workingDays
  }

  const handleCalculate = async (values: any) => {
    setLoading(true)
    try {
      const workingDays = calculateWorkingDays(values.month, values.year)
      const totalValue = workingDays * values.dailyValue
      const weekends = new Date(values.year, values.month, 0).getDate() - workingDays

      const result = {
        month: new Date(values.year, values.month - 1).toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
        workingDays,
        weekends,
        dailyValue: values.dailyValue,
        totalValue,
        totalDays: new Date(values.year, values.month, 0).getDate(),
      }

      setCalculation(result)
      message.success("Cálculo realizado com sucesso!")
    } catch (error) {
      message.error("Erro ao calcular")
    } finally {
      setLoading(false)
    }
  }

  const addToExpenses = () => {
    message.success("Valor adicionado às despesas mensais!")
  }

  const columns = [
    {
      title: "Período",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Dias Úteis",
      dataIndex: "workingDays",
      key: "workingDays",
      render: (days: number) => <Text strong>{days} dias</Text>,
    },
    {
      title: "Valor Diário",
      dataIndex: "dailyValue",
      key: "dailyValue",
      render: (value: number) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: "Total",
      dataIndex: "totalValue",
      key: "totalValue",
      render: (value: number) => (
        <Text strong style={{ color: "#1890ff" }}>
          R$ {value.toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={status === "Adicionado" ? "green" : "blue"}>{status}</Tag>,
    },
  ]

  return (
    <div>
      <Title level={2}>Calculadora de Vale Transporte</Title>
      <Text type="secondary">Calcule o gasto mensal com transporte baseado nos dias úteis</Text>

      <Alert
        message="Como funciona"
        description="O cálculo considera apenas os dias úteis do mês (segunda a sexta-feira), excluindo sábados e domingos. Feriados não são considerados automaticamente."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ margin: "24px 0" }}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CalculatorOutlined />
                Calcular Vale Transporte
              </div>
            }
            className="financial-card"
          >
            <Form form={form} layout="vertical" onFinish={handleCalculate}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="month" label="Mês" rules={[{ required: true, message: "Selecione o mês" }]}>
                    <Select placeholder="Selecione o mês">
                      {months.map((month) => (
                        <Option key={month.value} value={month.value}>
                          {month.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="year" label="Ano" rules={[{ required: true, message: "Selecione o ano" }]}>
                    <Select placeholder="Selecione o ano">
                      {years.map((year) => (
                        <Option key={year} value={year}>
                          {year}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="dailyValue"
                label="Valor Diário do Transporte"
                rules={[{ required: true, message: "Valor é obrigatório" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Ex: 8.50"
                  min={0}
                  precision={2}
                  formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/R\$\s?|(,*)/g, "")}
                />
              </Form.Item>

              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 16 }}>
                Valor que você gasta por dia com transporte (ida e volta)
              </Text>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} icon={<CarOutlined />} block>
                  Calcular Gasto Mensal
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CalendarOutlined />
                Resultado do Cálculo
              </div>
            }
            className="financial-card"
          >
            {calculation ? (
              <div>
                <div
                  style={{
                    textAlign: "center",
                    padding: 24,
                    background: "#f0f9ff",
                    borderRadius: 8,
                    marginBottom: 16,
                  }}
                >
                  <Title level={4} style={{ margin: 0, textTransform: "capitalize" }}>
                    {calculation.month}
                  </Title>
                  <Statistic
                    value={calculation.totalValue}
                    precision={2}
                    prefix="R$"
                    valueStyle={{ color: "#1890ff", fontSize: 32 }}
                  />
                  <Text type="secondary">Gasto total estimado</Text>
                </div>

                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={12}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: 16,
                        background: "#f6ffed",
                        borderRadius: 8,
                      }}
                    >
                      <Statistic value={calculation.workingDays} valueStyle={{ color: "#52c41a", fontSize: 24 }} />
                      <Text type="secondary">Dias úteis</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: 16,
                        background: "#fafafa",
                        borderRadius: 8,
                      }}
                    >
                      <Statistic value={calculation.weekends} valueStyle={{ color: "#666", fontSize: 24 }} />
                      <Text type="secondary">Fins de semana</Text>
                    </div>
                  </Col>
                </Row>

                <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>
                  <Row justify="space-between" style={{ marginBottom: 4 }}>
                    <Text>Valor diário:</Text>
                    <Text strong>R$ {calculation.dailyValue.toFixed(2)}</Text>
                  </Row>
                  <Row justify="space-between" style={{ marginBottom: 4 }}>
                    <Text>Total de dias no mês:</Text>
                    <Text strong>{calculation.totalDays} dias</Text>
                  </Row>
                  <Row justify="space-between" style={{ marginBottom: 4 }}>
                    <Text>Dias úteis:</Text>
                    <Text strong>{calculation.workingDays} dias</Text>
                  </Row>
                  <Row justify="space-between" style={{ borderTop: "1px solid #f0f0f0", paddingTop: 8 }}>
                    <Text strong>Total a gastar:</Text>
                    <Text strong style={{ color: "#1890ff" }}>
                      R$ {calculation.totalValue.toFixed(2)}
                    </Text>
                  </Row>
                </div>

                <Button type="dashed" icon={<PlusOutlined />} onClick={addToExpenses} block>
                  Adicionar às Despesas Mensais
                </Button>
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "#999",
                }}
              >
                <CarOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <Text type="secondary">Preencha os campos ao lado para calcular o gasto mensal</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Histórico de Cálculos" className="financial-card" style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={calculationsHistory}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} cálculos`,
          }}
        />
      </Card>
    </div>
  )
}

export default TransportCalculator
