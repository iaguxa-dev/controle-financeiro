"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function TransactionForm() {
  const [date, setDate] = useState<Date>()
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "receita",
      description: "Salário",
      amount: 5000,
      category: "Trabalho",
      date: "2024-01-05",
      status: "pago",
    },
    {
      id: 2,
      type: "despesa",
      description: "Supermercado",
      amount: 387.45,
      category: "Alimentação",
      date: "2024-01-03",
      status: "pago",
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-inter">Receitas e Despesas</h1>
        <p className="text-gray-600 font-inter">Gerencie suas transações financeiras</p>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add" className="font-inter">
            Adicionar Transação
          </TabsTrigger>
          <TabsTrigger value="list" className="font-inter">
            Lista de Transações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário de Receita */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 font-inter">Nova Receita</CardTitle>
                <CardDescription className="font-inter">Adicione uma nova entrada de dinheiro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="receita-desc" className="font-inter">
                    Descrição
                  </Label>
                  <Input id="receita-desc" placeholder="Ex: Salário, Freelance..." className="font-inter" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receita-valor" className="font-inter">
                    Valor
                  </Label>
                  <Input id="receita-valor" type="number" placeholder="0,00" className="font-inter" />
                </div>

                <div className="space-y-2">
                  <Label className="font-inter">Categoria</Label>
                  <Select>
                    <SelectTrigger className="font-inter">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trabalho" className="font-inter">
                        Trabalho
                      </SelectItem>
                      <SelectItem value="freelance" className="font-inter">
                        Freelance
                      </SelectItem>
                      <SelectItem value="investimentos" className="font-inter">
                        Investimentos
                      </SelectItem>
                      <SelectItem value="outros" className="font-inter">
                        Outros
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-inter">Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal font-inter bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 font-inter">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Receita
                </Button>
              </CardContent>
            </Card>

            {/* Formulário de Despesa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 font-inter">Nova Despesa</CardTitle>
                <CardDescription className="font-inter">Registre uma nova saída de dinheiro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="despesa-desc" className="font-inter">
                    Descrição
                  </Label>
                  <Input id="despesa-desc" placeholder="Ex: Supermercado, Combustível..." className="font-inter" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="despesa-valor" className="font-inter">
                    Valor
                  </Label>
                  <Input id="despesa-valor" type="number" placeholder="0,00" className="font-inter" />
                </div>

                <div className="space-y-2">
                  <Label className="font-inter">Categoria</Label>
                  <Select>
                    <SelectTrigger className="font-inter">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alimentacao" className="font-inter">
                        Alimentação
                      </SelectItem>
                      <SelectItem value="transporte" className="font-inter">
                        Transporte
                      </SelectItem>
                      <SelectItem value="moradia" className="font-inter">
                        Moradia
                      </SelectItem>
                      <SelectItem value="saude" className="font-inter">
                        Saúde
                      </SelectItem>
                      <SelectItem value="educacao" className="font-inter">
                        Educação
                      </SelectItem>
                      <SelectItem value="lazer" className="font-inter">
                        Lazer
                      </SelectItem>
                      <SelectItem value="outros" className="font-inter">
                        Outros
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-inter">Status</Label>
                  <Select>
                    <SelectTrigger className="font-inter">
                      <SelectValue placeholder="Status do pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pago" className="font-inter">
                        Pago
                      </SelectItem>
                      <SelectItem value="pendente" className="font-inter">
                        Pendente
                      </SelectItem>
                      <SelectItem value="vencido" className="font-inter">
                        Vencido
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-inter">Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal font-inter bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700 font-inter">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Despesa
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-inter">Transações Recentes</CardTitle>
              <CardDescription className="font-inter">Histórico das suas movimentações financeiras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={transaction.type === "receita" ? "default" : "destructive"}
                          className={`font-inter ${transaction.type === "receita" ? "bg-green-600" : "bg-red-600"}`}
                        >
                          {transaction.type === "receita" ? "Receita" : "Despesa"}
                        </Badge>
                        <h3 className="font-medium font-inter">{transaction.description}</h3>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="font-inter">{transaction.category}</span>
                        <span className="font-inter">{transaction.date}</span>
                        <Badge variant="outline" className="font-inter">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-lg font-bold font-inter ${
                          transaction.type === "receita" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "receita" ? "+" : "-"}R$ {transaction.amount.toFixed(2)}
                      </span>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
