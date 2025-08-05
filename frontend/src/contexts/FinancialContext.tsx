"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"

interface Transaction {
  id: string
  type: "income" | "expense"
  description: string
  amount: number
  category: string
  date: string
  status: "paid" | "pending" | "overdue"
}

interface FinancialSummary {
  currentBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  creditCardBalance: number
  expensesByCategory?: Array<{
    name: string
    amount: number
    percentage: number
  }>
}

interface FinancialContextType {
  transactions: Transaction[]
  summary: FinancialSummary
  pendingBills: any[]
  paidBills: any[]
  loading: boolean
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  refreshData: () => Promise<void>
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

export const useFinancial = () => {
  const context = useContext(FinancialContext)
  if (context === undefined) {
    throw new Error("useFinancial must be used within a FinancialProvider")
  }
  return context
}

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<FinancialSummary>({
    currentBalance: 5847.32,
    monthlyIncome: 8500.0,
    monthlyExpenses: 2652.68,
    creditCardBalance: 1234.56,
    expensesByCategory: [
      { name: "Alimentação", amount: 587.45, percentage: 22.1 },
      { name: "Transporte", amount: 320.0, percentage: 12.1 },
      { name: "Moradia", amount: 1200.0, percentage: 45.2 },
      { name: "Lazer", amount: 245.23, percentage: 9.2 },
      { name: "Outros", amount: 300.0, percentage: 11.4 },
    ],
  })
  const [pendingBills] = useState([
    {
      id: 1,
      description: "Energia Elétrica",
      amount: 245.8,
      daysUntilDue: 3,
      dueDate: "2024-01-15",
    },
    {
      id: 2,
      description: "Internet",
      amount: 89.9,
      daysUntilDue: 7,
      dueDate: "2024-01-19",
    },
  ])
  const [paidBills] = useState([
    {
      id: 1,
      description: "Aluguel",
      amount: 1200.0,
      paidDate: "05/01/2024",
    },
    {
      id: 2,
      description: "Supermercado",
      amount: 387.45,
      paidDate: "03/01/2024",
    },
  ])
  const [loading, setLoading] = useState(false)

  // Mock transactions data
  useEffect(() => {
    if (user) {
      setTransactions([
        {
          id: "1",
          type: "income",
          description: "Salário",
          amount: 5000,
          category: "Trabalho",
          date: "2024-01-05",
          status: "paid",
        },
        {
          id: "2",
          type: "expense",
          description: "Supermercado",
          amount: 387.45,
          category: "Alimentação",
          date: "2024-01-03",
          status: "paid",
        },
        {
          id: "3",
          type: "expense",
          description: "Combustível",
          amount: 150.0,
          category: "Transporte",
          date: "2024-01-02",
          status: "paid",
        },
      ])
    }
  }, [user])

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
      }

      setTransactions((prev) => [newTransaction, ...prev])

      // Update summary
      if (transaction.type === "income") {
        setSummary((prev) => ({
          ...prev,
          monthlyIncome: prev.monthlyIncome + transaction.amount,
          currentBalance: prev.currentBalance + transaction.amount,
        }))
      } else {
        setSummary((prev) => ({
          ...prev,
          monthlyExpenses: prev.monthlyExpenses + transaction.amount,
          currentBalance: prev.currentBalance - transaction.amount,
        }))
      }
    } finally {
      setLoading(false)
    }
  }

  const updateTransaction = async (id: string, updatedTransaction: Partial<Transaction>) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t)))
    } finally {
      setLoading(false)
    }
  }

  const deleteTransaction = async (id: string) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const transaction = transactions.find((t) => t.id === id)
      if (transaction) {
        setTransactions((prev) => prev.filter((t) => t.id !== id))

        // Update summary
        if (transaction.type === "income") {
          setSummary((prev) => ({
            ...prev,
            monthlyIncome: prev.monthlyIncome - transaction.amount,
            currentBalance: prev.currentBalance - transaction.amount,
          }))
        } else {
          setSummary((prev) => ({
            ...prev,
            monthlyExpenses: prev.monthlyExpenses - transaction.amount,
            currentBalance: prev.currentBalance + transaction.amount,
          }))
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    try {
      // Simulate API call to refresh all data
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setLoading(false)
    }
  }

  const value = {
    transactions,
    summary,
    pendingBills,
    paidBills,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshData,
  }

  return <FinancialContext.Provider value={value}>{children}</FinancialContext.Provider>
}
