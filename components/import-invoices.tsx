"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, AlertCircle, CheckCircle, Download } from "lucide-react"

export function ImportInvoices() {
  const [dragActive, setDragActive] = useState(false)
  const [importedInvoices, setImportedInvoices] = useState([
    {
      id: 1,
      name: "Fatura Janeiro 2024",
      competencia: "01/2024",
      estabelecimento: "Supermercado ABC",
      valor: 387.45,
      status: "processado",
    },
    {
      id: 2,
      name: "Fatura Janeiro 2024",
      competencia: "01/2024",
      estabelecimento: "Posto de Gasolina XYZ",
      valor: 150.0,
      status: "processado",
    },
  ])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    // Handle file drop logic here
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-inter">Importar Faturas</h1>
        <p className="text-gray-600 font-inter">Importe faturas de cartão de crédito em formato CSV ou Excel</p>
      </div>

      {/* Instruções */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="font-inter">
          <strong>Instruções para importação:</strong>
          <br />
          1. O arquivo deve conter as colunas: Nome, Competência, Estabelecimento, Valor
          <br />
          2. Formatos aceitos: CSV, XLS, XLSX
          <br />
          3. O valor deve estar no formato decimal (ex: 123.45)
          <br />
          4. A competência deve estar no formato MM/AAAA (ex: 01/2024)
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload de arquivo */}
        <Card>
          <CardHeader>
            <CardTitle className="font-inter">Upload de Fatura</CardTitle>
            <CardDescription className="font-inter">
              Arraste e solte seu arquivo ou clique para selecionar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 font-inter">Solte seus arquivos aqui</p>
              <p className="text-gray-600 font-inter">ou</p>
              <Button variant="outline" className="mt-2 font-inter bg-transparent">
                Selecionar arquivos
              </Button>
              <p className="text-xs text-gray-500 mt-2 font-inter">CSV, XLS, XLSX até 10MB</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competencia" className="font-inter">
                Competência
              </Label>
              <Input id="competencia" placeholder="MM/AAAA (ex: 01/2024)" className="font-inter" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes" className="font-inter">
                Observações (opcional)
              </Label>
              <Textarea
                id="observacoes"
                placeholder="Adicione observações sobre esta importação..."
                className="font-inter"
              />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 font-inter">
              <Upload className="w-4 h-4 mr-2" />
              Processar Importação
            </Button>
          </CardContent>
        </Card>

        {/* Template de exemplo */}
        <Card>
          <CardHeader>
            <CardTitle className="font-inter">Template de Exemplo</CardTitle>
            <CardDescription className="font-inter">Baixe um template para facilitar a importação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 font-inter">Estrutura do arquivo:</h4>
              <div className="text-sm space-y-1 font-mono">
                <div className="grid grid-cols-4 gap-2 font-bold">
                  <span>Nome</span>
                  <span>Competência</span>
                  <span>Estabelecimento</span>
                  <span>Valor</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-gray-600">
                  <span>Compra 1</span>
                  <span>01/2024</span>
                  <span>Supermercado</span>
                  <span>123.45</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-gray-600">
                  <span>Compra 2</span>
                  <span>01/2024</span>
                  <span>Farmácia</span>
                  <span>67.89</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full font-inter bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Baixar Template CSV
            </Button>

            <Button variant="outline" className="w-full font-inter bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Baixar Template Excel
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Lista de importações */}
      <Card>
        <CardHeader>
          <CardTitle className="font-inter">Faturas Importadas</CardTitle>
          <CardDescription className="font-inter">Histórico das suas importações de faturas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {importedInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium font-inter">{invoice.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-inter">Competência: {invoice.competencia}</span>
                      <span className="font-inter">{invoice.estabelecimento}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-red-600 font-inter">R$ {invoice.valor.toFixed(2)}</p>
                    <Badge variant="default" className="bg-green-600 font-inter">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
