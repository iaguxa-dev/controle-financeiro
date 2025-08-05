"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Row, Col, Card, Statistic, Progress, List, Badge, Button, Typography } from "antd"
import {
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import { useFinancial } from "../contexts/FinancialContext"

const { Title, Text } = Typography

const DashboardOverview: React.FC = () => {
  const { summary, pendingBills, paidBills, loading } = useFinancial()
  const [currentMonth, setCurrentMonth] = useState("")

  useEffect(() => {
    const now = new Date()
    setCurrentMonth(now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }))
  }, [])

  const summaryCards = [
    {
      title: "Saldo Atual",
      value: summary.currentBalance,
      prefix: "R$",
      precision: 2,
      valueStyle: { color: summary.currentBalance >= 0 ? "#3f8600" : "#cf1322" },
      icon: <DollarOutlined />,
      color: "#1890ff",
    },
    {
      title: "Receitas do Mês",
      value: summary.monthlyIncome,
      prefix: "R$",
      precision: 2,
      valueStyle: { color: "#3f8600" },
      icon: <ArrowUpOutlined />,
      color: "#52c41a",
    },
    {
      title: "Despesas do Mês",
      value: summary.monthlyExpenses,
      prefix: "R$",
      precision: 2,
      valueStyle: { color: "#cf1322" },
      icon: <ArrowDownOutlined />,
      color: "#ff4d4f",
    },
    {
      title: "Cartão de Crédito",
      value: summary.creditCardBalance,
      prefix: "R$",
      precision: 2,
      valueStyle: { color: "#fa8c16" },
      icon: <CreditCardOutlined />,
      color: "#fa8c16",
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Dashboard
          </Title>
          <Text type="secondary" style={{ textTransform: "capitalize" }}>
            {currentMonth}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<CalendarOutlined />}
          style={{ display: window.innerWidth < 768 ? "none" : "inline-flex" }}
        >
          Alterar período
        </Button>
      </div>

      {/* Cards de Resumo */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {summaryCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="financial-card" loading={loading}>
              <Statistic
                title={card.title}
                value={card.value}
                precision={card.precision}
                valueStyle={card.valueStyle}
                prefix={card.prefix}
                suffix={
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `${card.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.color,
                      fontSize: 18,
                    }}
                  >
                    {card.icon}
                  </div>
                }
              />
              {index === 0 && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    +12.5% em relação ao mês anterior
                  </Text>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Contas a Pagar e Pagas */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                Contas a Pagar
              </div>
            }
            extra={<Badge count={pendingBills.length} />}
            className="financial-card"
            loading={loading}
          >
            <List
              dataSource={pendingBills}
              renderItem={(bill: any) => (
                <List.Item>
                  <List.Item.Meta title={bill.description} description={`Vence em ${bill.daysUntilDue} dias`} />
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 600, color: "#ff4d4f" }}>R$ {bill.amount.toFixed(2)}</div>
                    <Badge
                      status={bill.daysUntilDue <= 3 ? "error" : "warning"}
                      text={bill.daysUntilDue <= 3 ? "Urgente" : "Pendente"}
                    />
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: "Nenhuma conta pendente" }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
                Contas Pagas
              </div>
            }
            extra={<Badge count={paidBills.length} style={{ backgroundColor: "#52c41a" }} />}
            className="financial-card"
            loading={loading}
          >
            <List
              dataSource={paidBills}
              renderItem={(bill: any) => (
                <List.Item>
                  <List.Item.Meta title={bill.description} description={`Pago em ${bill.paidDate}`} />
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 600, color: "#52c41a" }}>R$ {bill.amount.toFixed(2)}</div>
                    <Badge status="success" text="Pago" />
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: "Nenhuma conta paga este mês" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Gráfico de Gastos por Categoria */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Gastos por Categoria" className="financial-card" loading={loading}>
            {summary.expensesByCategory?.map((category: any, index: number) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text>{category.name}</Text>
                  <Text strong>
                    R$ {category.amount.toFixed(2)} ({category.percentage}%)
                  </Text>
                </div>
                <Progress percent={category.percentage} strokeColor={`hsl(${index * 60}, 70%, 50%)`} showInfo={false} />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardOverview
