"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, DollarSign, TrendingUp, Users } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Financial Control Info */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-inter">Controle Financeiro</h1>
            <p className="text-xl text-gray-600 font-inter">
              Gerencie suas finanças de forma inteligente e compartilhada
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 font-inter">Receitas e Despesas</h3>
                <p className="text-gray-600 font-inter">Controle completo do seu fluxo de caixa</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 font-inter">Dashboard e Relatórios</h3>
                <p className="text-gray-600 font-inter">Visualize seus dados financeiros em tempo real</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 font-inter">Compartilhamento</h3>
                <p className="text-gray-600 font-inter">Gerencie finanças em conjunto com outras pessoas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center font-inter">Acesse sua conta</CardTitle>
            <CardDescription className="text-center font-inter">
              Entre com suas credenciais ou crie uma nova conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login" className="font-inter">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="font-inter">
                  Cadastro
                </TabsTrigger>
                <TabsTrigger value="recover" className="font-inter">
                  Recuperar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-inter">
                    Email
                  </Label>
                  <Input id="email" type="email" placeholder="seu@email.com" className="font-inter" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-inter">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      className="pr-10 font-inter"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 font-inter">Entrar</Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-inter">
                    Nome completo
                  </Label>
                  <Input id="name" type="text" placeholder="Seu nome completo" className="font-inter" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register" className="font-inter">
                    Email
                  </Label>
                  <Input id="email-register" type="email" placeholder="seu@email.com" className="font-inter" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register" className="font-inter">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password-register"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha"
                      className="pr-10 font-inter"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="font-inter">
                    Confirmar senha
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirme sua senha"
                    className="font-inter"
                  />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 font-inter">Criar conta</Button>
              </TabsContent>

              <TabsContent value="recover" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email-recover" className="font-inter">
                    Email
                  </Label>
                  <Input id="email-recover" type="email" placeholder="seu@email.com" className="font-inter" />
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 font-inter">
                  Enviar link de recuperação
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
