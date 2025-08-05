"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Menu } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { TransactionForm } from "@/components/transaction-form"
import { ImportInvoices } from "@/components/import-invoices"
import { Reports } from "@/components/reports"
import { ShareAccount } from "@/components/share-account"
import { TransportCalculator } from "@/components/transport-calculator"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 lg:ml-64">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold font-inter">Controle Financeiro</h1>
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="p-4 lg:p-8">
            {activeTab === "overview" && <DashboardOverview />}
            {activeTab === "transactions" && <TransactionForm />}
            {activeTab === "import" && <ImportInvoices />}
            {activeTab === "reports" && <Reports />}
            {activeTab === "share" && <ShareAccount />}
            {activeTab === "transport" && <TransportCalculator />}
          </div>
        </div>
      </div>
    </div>
  )
}
