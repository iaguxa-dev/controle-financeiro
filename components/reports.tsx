"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileText, Download, CalendarIcon, TrendingUp, TrendingDown, PieChart, BarChart3 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function Reports() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [reportType, setReportType] = useState("")

  const reports = [
    {
      id: 1,
      name: "Relatório Mensal - Janeiro 2024",
      type: "Mensal",
      period: "01/2024",
      createdAt: "05/01/2024",
      status: "Gerado",
    },
    {
      id: 2,
      name: "Relatório por Categoria - Q4 2023",
      type: "Categoria",
      period: "Q4/2023",
      createdAt: "02/01/2024",
      status: "Gerado",
    },
  ]

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-inter">Relatórios</h1>
        <p className="text-gray-600 font-inter">Gere e visualize relatórios detalhados das suas finanças</p>
      </div>

      {/* Gerador de relatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-inter">
            <FileText className="h-5 w-5" />
            Gerar Novo Relatório
          </CardTitle>
          <CardDescription className="font-inter">
            Configure os parâmetros para gerar um relatório personalizado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-inter">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="font-inter">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal" className="font-inter">
                    Relatório Mensal
                  </SelectItem>
                  <SelectItem value="categoria" className="font-inter">
                    Por Categoria
                  </SelectItem>
                  <SelectItem value="comparativo" className="font-inter">
                    Comparativo
                  </SelectItem>
                  <SelectItem value="fluxo" className="font-inter">
                    Fluxo de Caixa
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium font-inter">Data Inicial</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal font-inter bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium font-inter">Data Final</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal font-inter bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 font-inter">
            <FileText className="w-4 h-4 mr-2" />
            Gerar Relatório
          </Button>
        </CardContent>
      </Card>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-inter">Total Receitas</p>
                <p className="text-2xl font-bold text-green-600 font-inter">
                  R$ {summaryData.totalReceitas.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-inter">Total Despesas</p>
                <p className="text-2xl font-bold text-red-600 font-inter">R$ {summaryData.totalDespesas.toFixed(2)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-inter">Saldo Final</p>
                <p className="text-2xl font-bold text-blue-600 font-inter">R$ {summaryData.saldoFinal.toFixed(2)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-inter">Maior Despesa</p>
                <p className="text-lg font-bold text-orange-600 font-inter">
                  R$ {summaryData.maiorDespesa.valor.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 font-inter">{summaryData.maiorDespesa.desc}</p>
              </div>
              <PieChart className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gastos por categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="font-inter">Gastos por Categoria</CardTitle>
          <CardDescription className="font-inter">Distribuição das suas despesas por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summaryData.categorias.map((categoria, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-4 h-4 rounded-full bg-blue-600"
                    style={{
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                    }}
                  />
                  <span className="font-medium font-inter">{categoria.nome}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-4">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${categoria.percentual}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold font-inter">R$ {categoria.valor.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 font-inter">{categoria.percentual}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de relatórios gerados */}
      <Card>
        <CardHeader>
          <CardTitle className="font-inter">Relatórios Gerados</CardTitle>
          <CardDescription className="font-inter">Histórico dos seus relatórios financeiros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium font-inter">{report.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-inter">Tipo: {report.type}</span>
                      <span className="font-inter">Período: {report.period}</span>
                      <span className="font-inter">Criado em: {report.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-green-600 font-inter">
                    {report.status}
                  </Badge>
                  <Button variant="outline" size="sm" className="font-inter bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
