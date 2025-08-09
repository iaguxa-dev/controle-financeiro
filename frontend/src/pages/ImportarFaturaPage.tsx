import { useState } from 'react'
import { 
  Upload, 
  Button, 
  Card, 
  Typography, 
  Steps, 
  Table, 
  Select, 
  Input, 
  Space, 
  message,
  Alert 
} from 'antd'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography
const { Step } = Steps
const { Dragger } = Upload
const { Option } = Select

interface FaturaItem {
  banco?: string
  competencia?: string
  estabelecimento?: string
  valor?: number
  data_transacao?: string
  [key: string]: any // Adicionar index signature para permitir atribuições dinâmicas
}

export default function ImportarFaturaPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [uploadedData, setUploadedData] = useState<any[]>([])
  const [mappedData, setMappedData] = useState<FaturaItem[]>([])
  const [columnMapping, setColumnMapping] = useState<{[key: string]: string}>({})

  const requiredFields = [
    { key: 'banco', label: 'Banco' },
    { key: 'competencia', label: 'Competência (MM/YYYY)' },
    { key: 'estabelecimento', label: 'Estabelecimento' },
    { key: 'valor', label: 'Valor' },
  ]

  // Mapeamento automático baseado em palavras-chave
  const autoMapColumns = (columns: string[]) => {
    const mapping: {[key: string]: string} = {}
    
    const mappingRules = {
      banco: [
        'banco', 'bank', 'instituicao', 'institution', 'emissor', 'issuer',
        'cartao', 'card', 'credito', 'credit'
      ],
      competencia: [
        'competencia', 'competência', 'mes', 'month', 'periodo', 'period', 
        'data_competencia', 'mesano', 'mes_ano', 'referencia'
      ],
      estabelecimento: [
        'estabelecimento', 'merchant', 'comercio', 'loja', 'store', 'nome', 'name', 
        'descricao', 'description', 'local', 'empresa', 'company', 'vendedor', 
        'fornecedor', 'supplier', 'beneficiario', 'destinatario'
      ],
      valor: [
        'valor', 'value', 'amount', 'preco', 'price', 'total', 'quantia',
        'importancia', 'montante', 'debito', 'credito', 'vlr'
      ]
    }
    
    // Para cada campo obrigatório
    Object.entries(mappingRules).forEach(([field, keywords]) => {
      // Procurar uma coluna que contenha alguma das palavras-chave
      const matchedColumn = columns.find(column => {
        const columnLower = column.toLowerCase().trim()
        return keywords.some(keyword => {
          // Verificar se a palavra-chave está contida na coluna ou se a coluna está contida na palavra-chave
          return columnLower.includes(keyword.toLowerCase()) || 
                 keyword.toLowerCase().includes(columnLower)
        })
      })
      
      if (matchedColumn) {
        mapping[field] = matchedColumn
      }
    })
    
    return mapping
  }

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv,.json',
    beforeUpload: (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          let data: any[] = []
          
          if (file.name.endsWith('.json')) {
            data = JSON.parse(e.target?.result as string)
          } else if (file.name.endsWith('.csv')) {
            // Simulação de parsing CSV - em produção usar biblioteca como papaparse
            const csvText = e.target?.result as string
            const lines = csvText.split('\n')
            const headers = lines[0].split(',')
            
            data = lines.slice(1).map(line => {
              const values = line.split(',')
              const obj: any = {}
              headers.forEach((header, index) => {
                obj[header.trim()] = values[index]?.trim()
              })
              return obj
            }).filter(item => Object.keys(item).length > 1)
          }
          
          setUploadedData(data)
          
          // Aplicar mapeamento automático se houver dados
          if (data.length > 0) {
            const columns = Object.keys(data[0])
            const autoMapping = autoMapColumns(columns)
            setColumnMapping(autoMapping)
            
            // Mostrar mensagem sobre o mapeamento automático
            const mappedCount = Object.keys(autoMapping).length
            if (mappedCount > 0) {
              message.success(`Arquivo carregado! ${mappedCount} de ${requiredFields.length} campos mapeados automaticamente.`)
            } else {
              message.success('Arquivo carregado! Faça o mapeamento manual das colunas.')
            }
          } else {
            message.success('Arquivo carregado com sucesso!')
          }
          
          setCurrentStep(1)
        } catch (error) {
          message.error('Erro ao processar arquivo')
        }
      }
      reader.readAsText(file)
      return false // Prevent upload
    },
  }

  const handleColumnMapping = (field: string, column: string) => {
    setColumnMapping(prev => ({ ...prev, [field]: column }))
  }

  const processMapping = () => {
    const mapped = uploadedData.map(item => {
      const mappedItem: FaturaItem = {}
      
      Object.entries(columnMapping).forEach(([field, column]) => {
        if (column && item[column] !== undefined) {
          if (field === 'valor') {
            mappedItem[field] = parseFloat(item[column].toString().replace(',', '.'))
          } else {
            mappedItem[field] = item[column]
          }
        }
      })
      
      return mappedItem
    })
    
    setMappedData(mapped)
    setCurrentStep(2)
  }

  const handleImport = () => {
    // Aqui você faria a chamada para a API para salvar os dados
    message.success(`${mappedData.length} itens importados com sucesso!`)
    
    // Reset
    setCurrentStep(0)
    setUploadedData([])
    setMappedData([])
    setColumnMapping({})
  }

  const availableColumns = uploadedData.length > 0 ? Object.keys(uploadedData[0]) : []

  const previewColumns = [
    {
      title: 'Banco',
      dataIndex: 'banco',
      key: 'banco',
    },
    {
      title: 'Competência',
      dataIndex: 'competencia',
      key: 'competencia',
    },
    {
      title: 'Estabelecimento',
      dataIndex: 'estabelecimento',
      key: 'estabelecimento',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      render: (valor: number) => valor ? `R$ ${valor.toFixed(2).replace('.', ',')}` : '-',
    },
  ]

  return (
    <div>
      <Title level={2}>Importar Fatura</Title>
      
      <div className="import-instructions">
        <Title level={4}>📋 Instruções para Importação</Title>
        <Paragraph>
          Para importar sua fatura de cartão de crédito, siga estas instruções:
        </Paragraph>
        <ul>
          <li>Baixe o extrato do seu cartão em formato CSV ou JSON</li>
          <li>Certifique-se de que o arquivo contém as seguintes informações:</li>
          <ul>
            <li><strong>Banco:</strong> Nome do banco emissor</li>
            <li><strong>Competência:</strong> Mês/Ano da fatura (ex: 01/2024)</li>
            <li><strong>Estabelecimento:</strong> Nome do estabelecimento</li>
            <li><strong>Valor:</strong> Valor da transação</li>
          </ul>
          <li>📍 <strong>Mapeamento Automático:</strong> O sistema tentará mapear as colunas automaticamente baseado nos nomes dos cabeçalhos</li>
          <li>Faça o upload do arquivo e verifique/ajuste o mapeamento das colunas</li>
          <li>Revise os dados antes de confirmar a importação</li>
        </ul>
        
        <Alert
          message="💡 Dica de Mapeamento"
          description="Para melhor mapeamento automático, use cabeçalhos como 'Banco', 'Competência', 'Estabelecimento', 'Valor' ou suas variações em inglês ('Bank', 'Period', 'Merchant', 'Amount')."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
        
        <div style={{ marginTop: 16 }}>
          <Paragraph strong>📁 Arquivos Modelo:</Paragraph>
          <Space>
            <Button 
              size="small" 
              href="/modelo-fatura.csv" 
              download="modelo-fatura.csv"
            >
              📥 Baixar Modelo (PT)
            </Button>
            <Button 
              size="small" 
              href="/modelo-fatura-en.csv" 
              download="modelo-fatura-en.csv"
            >
              📥 Baixar Modelo (EN)
            </Button>
          </Space>
        </div>
      </div>

      <Card>
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title="Upload" description="Carregar arquivo" />
          <Step title="Mapeamento" description="Mapear colunas" />
          <Step title="Revisão" description="Revisar e importar" />
        </Steps>

        {currentStep === 0 && (
          <div>
            <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Clique ou arraste o arquivo para esta área
              </p>
              <p className="ant-upload-hint">
                Suporte para arquivos CSV e JSON. Máximo 1 arquivo por vez.
              </p>
            </Dragger>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <Alert
              message="Mapeamento de Colunas"
              description={
                <div>
                  <p>Selecione qual coluna do seu arquivo corresponde a cada campo necessário.</p>
                  {Object.keys(columnMapping).length > 0 && (
                    <p style={{ color: '#52c41a', marginTop: 8 }}>
                      ✅ {Object.keys(columnMapping).length} de {requiredFields.length} campos foram mapeados automaticamente. 
                      Verifique se estão corretos e complete os campos restantes.
                    </p>
                  )}
                </div>
              }
              type="info"
              style={{ marginBottom: 24 }}
            />
            
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {requiredFields.map(field => {
                const isAutoMapped = columnMapping[field.key]
                return (
                  <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ minWidth: 200 }}>
                      <strong>{field.label}:</strong>
                      {isAutoMapped && (
                        <span style={{ color: '#52c41a', fontSize: '12px', marginLeft: 8 }}>
                          (Auto)
                        </span>
                      )}
                    </div>
                    <Select
                      style={{ width: 200 }}
                      placeholder="Selecione a coluna"
                      value={columnMapping[field.key] || undefined}
                      onChange={(value) => handleColumnMapping(field.key, value)}
                    >
                      <Option value="">-- Não mapear --</Option>
                      {availableColumns.map(column => (
                        <Option key={column} value={column}>
                          {column}
                        </Option>
                      ))}
                    </Select>
                    {columnMapping[field.key] && (
                      <span style={{ color: '#666', fontSize: '12px' }}>
                        Mapeado para: <strong>{columnMapping[field.key]}</strong>
                      </span>
                    )}
                  </div>
                )
              })}
            </Space>

            {/* Preview dos dados para ajudar no mapeamento */}
            <div style={{ marginTop: 32 }}>
              <Title level={5}>Preview dos Dados (Primeiras 3 linhas)</Title>
              <Table
                size="small"
                dataSource={uploadedData.slice(0, 3)}
                columns={availableColumns.map(col => ({
                  title: col,
                  dataIndex: col,
                  key: col,
                  width: 150,
                  ellipsis: true,
                  render: (text: any) => text || '-'
                }))}
                pagination={false}
                scroll={{ x: true }}
                bordered
              />
            </div>

            <div style={{ marginTop: 24 }}>
              <Space>
                <Button 
                  type="default"
                  onClick={() => {
                    // Limpar mapeamento para permitir seleção manual completa
                    setColumnMapping({})
                    message.info('Mapeamento limpo. Faça a seleção manual.')
                  }}
                >
                  Limpar Mapeamento
                </Button>
                <Button 
                  type="primary" 
                  onClick={processMapping}
                  disabled={Object.keys(columnMapping).length < requiredFields.length}
                >
                  Processar Mapeamento
                </Button>
              </Space>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <Alert
              message="Revisão dos Dados"
              description={`${mappedData.length} itens serão importados. Revise os dados abaixo antes de confirmar.`}
              type="success"
              style={{ marginBottom: 24 }}
            />

            <Table
              columns={previewColumns}
              dataSource={mappedData}
              rowKey={(record, index) => index?.toString() || '0'}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />

            <div style={{ marginTop: 24 }}>
              <Space>
                <Button onClick={() => setCurrentStep(1)}>
                  Voltar
                </Button>
                <Button type="primary" onClick={handleImport}>
                  Confirmar Importação
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
