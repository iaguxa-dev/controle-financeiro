"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Users, UserPlus, UserMinus, Share2, Key } from "lucide-react"

export function ShareAccount() {
  const [shareCode, setShareCode] = useState("FIN-2024-ABC123")
  const [sharedUsers, setSharedUsers] = useState([
    {
      id: 1,
      name: "Maria Silva",
      email: "maria@email.com",
      role: "Administrador",
      joinedAt: "15/12/2023",
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao@email.com",
      role: "Visualizador",
      joinedAt: "20/12/2023",
    },
  ])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Add toast notification here
  }

  const generateNewCode = () => {
    const newCode = `FIN-2024-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    setShareCode(newCode)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-inter">Compartilhar Conta</h1>
        <p className="text-gray-600 font-inter">Gerencie o acesso compartilhado às suas finanças</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gerar código de compartilhamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-inter">
              <Share2 className="h-5 w-5" />
              Gerar Código de Compartilhamento
            </CardTitle>
            <CardDescription className="font-inter">Crie um código único para compartilhar sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Key className="h-4 w-4" />
              <AlertDescription className="font-inter">
                <strong>Código atual:</strong> Este código permite acesso total à sua conta financeira. Compartilhe
                apenas com pessoas de confiança.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label className="font-inter">Código de Compartilhamento</Label>
              <div className="flex gap-2">
                <Input value={shareCode} readOnly className="font-mono font-inter" />
                <Button variant="outline" onClick={() => copyToClipboard(shareCode)} className="font-inter">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={generateNewCode} className="flex-1 bg-blue-600 hover:bg-blue-700 font-inter">
                Gerar Novo Código
              </Button>
              <Button variant="outline" className="font-inter bg-transparent">
                Desativar Código
              </Button>
            </div>

            <div className="text-sm text-gray-600 space-y-1 font-inter">
              <p>• O código expira em 7 dias</p>
              <p>• Máximo de 5 pessoas por conta</p>
              <p>• Você pode revogar o acesso a qualquer momento</p>
            </div>
          </CardContent>
        </Card>

        {/* Inserir código */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-inter">
              <UserPlus className="h-5 w-5" />
              Acessar Conta Compartilhada
            </CardTitle>
            <CardDescription className="font-inter">
              Insira um código para acessar uma conta compartilhada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-code" className="font-inter">
                Código de Acesso
              </Label>
              <Input id="access-code" placeholder="FIN-2024-XXXXXX" className="font-mono font-inter" />
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700 font-inter">
              <UserPlus className="w-4 h-4 mr-2" />
              Acessar Conta
            </Button>

            <Alert>
              <AlertDescription className="font-inter">
                Ao inserir um código, você terá acesso às informações financeiras da conta compartilhada. Certifique-se
                de que tem permissão para isso.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Lista de usuários compartilhados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-inter">
            <Users className="h-5 w-5" />
            Usuários com Acesso
          </CardTitle>
          <CardDescription className="font-inter">Pessoas que têm acesso à sua conta financeira</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sharedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-medium text-blue-600 font-inter">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium font-inter">{user.name}</h3>
                    <p className="text-sm text-gray-600 font-inter">{user.email}</p>
                    <p className="text-xs text-gray-500 font-inter">Entrou em {user.joinedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={user.role === "Administrador" ? "default" : "secondary"} className="font-inter">
                    {user.role}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 font-inter">
                    <UserMinus className="w-4 h-4" />
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
