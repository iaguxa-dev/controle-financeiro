"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, TrendingDown, Calendar, CreditCard, AlertCircle, CheckCircle } from "lucide-react"

export function DashboardOverview() {
  const currentMonth = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-inter">Dashboard</h1>
          <p className="text-gray-600 font-inter capitalize">{currentMonth}</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 font-inter">
          <Calendar className="w-4 h-4 mr-2" />
          Alterar período
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-inter">Saldo Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 font-inter">R$ 5.847,32</div>
            <p className="text-xs text-muted-foreground font-inter">+12.5% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-inter">Receitas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 font-inter">R$ 8.500,00</div>
            <p className="text-xs text-muted-foreground font-inter">3 receitas registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-inter">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 font-inter">R$ 2.652,68</div>
            <p className="text-xs text-muted-foreground font-inter">15 despesas registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-inter">Cartão de Crédito</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 font-inter">R$ 1.234,56</div>
            <p className="text-xs text-muted-foreground font-inter">Fatura atual</p>
          </CardContent>
        </Card>
      </div>

      {/* Contas a pagar e pagas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-inter">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Contas a Pagar
            </CardTitle>
            <CardDescription className="font-inter">Próximos vencimentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium font-inter">Energia Elétrica</p>
                <p className="text-sm text-gray-600 font-inter">Vence em 3 dias</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-600 font-inter">R$ 245,80</p>
                <Badge variant="destructive" className="font-inter">
                  Urgente
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium font-inter">Internet</p>
                <p className="text-sm text-gray-600 font-inter">Vence em 7 dias</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-yellow-600 font-inter">R$ 89,90</p>
                <Badge variant="secondary" className="font-inter">
                  Pendente
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-inter">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Contas Pagas
            </CardTitle>
            <CardDescription className="font-inter">Pagamentos realizados este mês</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium font-inter">Aluguel</p>
                <p className="text-sm text-gray-600 font-inter">Pago em 05/01</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 font-inter">R$ 1.200,00</p>
                <Badge variant="default" className="bg-green-600 font-inter">
                  Pago
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium font-inter">Supermercado</p>
                <p className="text-sm text-gray-600 font-inter">Pago em 03/01</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 font-inter">R$ 387,45</p>
                <Badge variant="default" className="bg-green-600 font-inter">
                  Pago
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
