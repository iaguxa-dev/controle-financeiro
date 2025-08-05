"use client"

import { Button } from "@/components/ui/button"
import { Home, PlusCircle, Upload, FileText, Users, Bus, Settings, LogOut } from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "transactions", label: "Receitas/Despesas", icon: PlusCircle },
    { id: "import", label: "Importar Faturas", icon: Upload },
    { id: "reports", label: "Relatórios", icon: FileText },
    { id: "share", label: "Compartilhar", icon: Users },
    { id: "transport", label: "Vale Transporte", icon: Bus },
  ]

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform lg:translate-x-0 lg:static lg:inset-0">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-gray-900 font-inter">FinanceControl</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start font-inter ${
                  activeTab === item.id ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Button variant="ghost" className="w-full justify-start font-inter text-gray-700">
            <Settings className="w-5 h-5 mr-3" />
            Configurações
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-inter text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}
