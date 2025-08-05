"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bus, Calculator, Calendar, Info, PlusCircle } from "lucide-react"

export function TransportCalculator() {
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [transportValue, setTransportValue] = useState("")
  const [calculation, setCalculation] = useState<any>(null)
  const [calculationsHistory, setCalculationsHistory] = useState<any[]>([])

  // Função para calcular dias úteis do mês
  const calculateWorkingDays = (month: number, year: number) => {
    const daysInMonth = new Date(year, month, 0).getDate()
    let workingDays = 0

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dayOfWeek = date.getDay()
      // 0 = Domingo, 6 = Sábado
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++
      }
    }

    return workingDays
  }

  const handleCalculate = () => {
    if (!selectedMonth || !selectedYear || !transportValue) return

    const month = Number.parseInt(selectedMonth)
    const year = Number.parseInt(selectedYear)
    const dailyValue = Number.parseFloat(transportValue)

    const workingDays = calculateWorkingDays(month, year)
    const totalValue = workingDays * dailyValue
    const weekends = new Date(year, month, 0).getDate() - workingDays

    const newCalculation = {
      month: new Date(year, month - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      workingDays,
      weekends,
      dailyValue,
      totalValue,
      totalDays: new Date(year, month, 0).getDate(),
      status: "Calculado",
    }

    setCalculation(newCalculation)
    setCalculationsHistory([...calculationsHistory, newCalculation])
  }

  const months = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-inter">Calculadora de Vale Transporte</h1>
        <p className="text-gray-600 font-inter">Calcule o gasto mensal com transporte baseado nos dias úteis</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="font-inter">
          <strong>Como funciona:</strong> O cálculo considera apenas os dias úteis do mês (segunda a sexta-feira),
          excluindo sábados e domingos. Feriados não são considerados automaticamente.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de cálculo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-inter">
              <Calculator className="h-5 w-5" />
              Calcular Vale Transporte
            </CardTitle>
            <CardDescription className="font-inter">Informe o período e valor diário do transporte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-inter">Mês</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="font-inter">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value} className="font-inter">
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-inter">Ano</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="font-inter">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()} className="font-inter">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transport-value" className="font-inter">
                Valor Diário do Transporte
              </Label>
              <Input
                id="transport-value"
                type="number"
                step="0.01"
                placeholder="Ex: 8.50"
                value={transportValue}
                onChange={(e) => setTransportValue(e.target.value)}
                className="font-inter"
              />
              <p className="text-xs text-gray-500 font-inter">
                Valor que você gasta por dia com transporte (ida e volta)
              </p>
            </div>

            <Button
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 font-inter"
              disabled={!selectedMonth || !selectedYear || !transportValue}
            >
              <Bus className="w-4 h-4 mr-2" />
              Calcular Gasto Mensal
            </Button>
          </CardContent>
        </Card>

        {/* Resultado do cálculo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-inter">
              <Calendar className="h-5 w-5" />
              Resultado do Cálculo
            </CardTitle>
            <CardDescription className="font-inter">Detalhamento do gasto mensal com transporte</CardDescription>
          </CardHeader>
          <CardContent>
            {calculation ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 font-inter capitalize">{calculation.month}</h3>
                  <p className="text-3xl font-bold text-blue-600 font-inter">R$ {calculation.totalValue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 font-inter">Gasto total estimado</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 font-inter">{calculation.workingDays}</p>
                    <p className="text-sm text-gray-600 font-inter">Dias úteis</p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-600 font-inter">{calculation.weekends}</p>
                    <p className="text-sm text-gray-600 font-inter">Fins de semana</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 font-inter">
                  <div className="flex justify-between">
                    <span>Valor diário:</span>
                    <span className="font-medium">R$ {calculation.dailyValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de dias no mês:</span>
                    <span className="font-medium">{calculation.totalDays} dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dias úteis:</span>
                    <span className="font-medium">{calculation.workingDays} dias</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total a gastar:</span>
                    <span className="font-bold text-blue-600">R$ {calculation.totalValue.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full font-inter bg-transparent"
                  onClick={() => {
                    // Add to expenses logic here
                  }}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Adicionar às Despesas Mensais
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bus className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p className="font-inter">Preencha os campos acima para calcular o gasto mensal</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Histórico de cálculos */}
      <Card>
        <CardHeader>
          <CardTitle className="font-inter">Histórico de Cálculos</CardTitle>
          <CardDescription className="font-inter">Seus cálculos anteriores de vale transporte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {calculationsHistory.map((calc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium font-inter">{calc.month}</h3>
                  <p className="text-sm text-gray-600 font-inter">
                    {calc.workingDays} dias úteis • R$ {calc.dailyValue.toFixed(2)}/dia
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 font-inter">R$ {calc.totalValue.toFixed(2)}</p>
                  <Badge
                    variant={calc.status === "Adicionado" ? "default" : "outline"}
                    className={calc.status === "Adicionado" ? "bg-green-600 font-inter" : "font-inter"}
                  >
                    {calc.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
