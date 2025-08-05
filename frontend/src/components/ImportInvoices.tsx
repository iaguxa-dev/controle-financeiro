"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  Upload,
  Button,
  Form,
  Input,
  Select,
  Table,
  Tag,
  Alert,
  Typography,
  Row,
  Col,
  message,
  Progress,
} from "antd"
import {
  UploadOutlined,
  FileTextOutlined,
  DownloadOutlined,
  InboxOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"

const { Title, Paragraph, Text } = Typography
const { Dragger } = Upload
const { TextArea } = Input
const { Option } = Select

const ImportInvoices: React.FC = () => {
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState(false)
  const [importedInvoices, setImportedInvoices] = useState([
    {
      id: 1,
      fileName: "fatura_janeiro_2024.csv",
      competencia: "01/2024",
      totalAmount: 1234.56,
      totalItems: 15,
      status: "processed",
      createdAt: "2024-01-05",
    },
    {
      id: 2,
      fileName: "fatura_dezembro_2023.xlsx",
      competencia: "12/2023",
      totalAmount: 987.43,
      totalItems: 12,
      status: "processed",
      createdAt: "2024-01-02",
    },
  ])

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".csv,.xlsx,.xls",
    beforeUpload: (file: any) => {
      const isValidType =
        file.type === "text/csv" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"

      if (!isValidType) {
        message.error("Apenas arquivos CSV, XLS e XLSX são permitidos!")
        return false
      }

      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error("Arquivo deve ser menor que 10MB!")
        return false
      }

      return false // Prevent auto upload
    },
    onChange: (info: any) => {
      console.log("File info:", info)
    },
  }

  const handleImport = async (values: any) => {
    setUploading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      message.success("Fatura importada com sucesso!")
      form.resetFields()
    } catch (error) {
      message.error("Erro ao importar fatura")
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = (type: "csv" | "excel") => {
    // Simulate template download
    message.info(`Download do template ${type.toUpperCase()} iniciado`)
  }

  const columns = [
    {
      title: "Arquivo",
      dataIndex: "fileName",
      key: "fileName",
      render: (fileName: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FileTextOutlined style={{ color: "#1890ff" }} />
          <Text>{fileName}</Text>
        </div>
      ),
    },
    {
      title: "Competência",
      dataIndex: "competencia",
      key: "competencia",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <Text strong style={{ color: "#ff4d4f" }}>
          R$ {amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Itens",
      dataIndex: "totalItems",
      key: "totalItems",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Processado
        </Tag>
      ),
    },
    {
      title: "Data",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("pt-BR"),
    },
  ]

  return (
    <div>
      <Title level={2}>Importar Faturas</Title>
      <Paragraph>Importe faturas de cartão de crédito em formato CSV ou Excel</Paragraph>

      <Alert
        message="Instruções para importação"
        description={
          <div>
            <p>
              <strong>1.</strong> O arquivo deve conter as colunas: Nome, Competência, Estabelecimento, Valor
            </p>
            <p>
              <strong>2.</strong> Formatos aceitos: CSV, XLS, XLSX
            </p>
            <p>
              <strong>3.</strong> O valor deve estar no formato decimal (ex: 123.45)
            </p>
            <p>
              <strong>4.</strong> A competência deve estar no formato MM/AAAA (ex: 01/2024)
            </p>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Upload de Fatura" className="financial-card">
            <Form form={form} layout="vertical" onFinish={handleImport}>
              <Form.Item name="file">
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Clique ou arraste o arquivo para esta área</p>
                  <p className="ant-upload-hint">Suporte para CSV, XLS, XLSX até 10MB</p>
                </Dragger>
              </Form.Item>

              <Form.Item
                name="competencia"
                label="Competência"
                rules={[{ required: true, message: "Competência é obrigatória" }]}
              >
                <Input placeholder="MM/AAAA (ex: 01/2024)" />
              </Form.Item>

              <Form.Item name="observacoes" label="Observações (opcional)">
                <TextArea rows={3} placeholder="Adicione observações sobre esta importação..." />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={uploading} icon={<UploadOutlined />} block>
                  {uploading ? "Processando..." : "Processar Importação"}
                </Button>
              </Form.Item>

              {uploading && <Progress percent={65} status="active" />}
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Template de Exemplo" className="financial-card">
            <Paragraph>Baixe um template para facilitar a importação</Paragraph>

            <div
              style={{
                background: "#f5f5f5",
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <Title level={5}>Estrutura do arquivo:</Title>
              <div style={{ fontFamily: "monospace", fontSize: 12 }}>
                <Row style={{ fontWeight: "bold", marginBottom: 8 }}>
                  <Col span={6}>Nome</Col>
                  <Col span={6}>Competência</Col>
                  <Col span={6}>Estabelecimento</Col>
                  <Col span={6}>Valor</Col>
                </Row>
                <Row style={{ color: "#666", marginBottom: 4 }}>
                  <Col span={6}>Compra 1</Col>
                  <Col span={6}>01/2024</Col>
                  <Col span={6}>Supermercado</Col>
                  <Col span={6}>123.45</Col>
                </Row>
                <Row style={{ color: "#666" }}>
                  <Col span={6}>Compra 2</Col>
                  <Col span={6}>01/2024</Col>
                  <Col span={6}>Farmácia</Col>
                  <Col span={6}>67.89</Col>
                </Row>
              </div>
            </div>

            <Button
              block
              icon={<DownloadOutlined />}
              onClick={() => downloadTemplate("csv")}
              style={{ marginBottom: 8 }}
            >
              Baixar Template CSV
            </Button>

            <Button block icon={<DownloadOutlined />} onClick={() => downloadTemplate("excel")}>
              Baixar Template Excel
            </Button>
          </Card>
        </Col>
      </Row>

      <Card title="Faturas Importadas" className="financial-card" style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={importedInvoices}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} faturas`,
          }}
        />
      </Card>
    </div>
  )
}

export default ImportInvoices
