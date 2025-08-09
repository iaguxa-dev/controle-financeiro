import api from './api'

export interface Despesa {
  id: string
  user_id: string
  descricao: string
  valor: number
  data_vencimento: string
  data_pagamento?: string
  categoria?: string
  status: 'pendente' | 'pago' | 'vencido'
  observacoes?: string
  created_at: string
  updated_at: string
  is_own?: boolean
  owner_name?: string
  owner_email?: string
}

export interface CreateDespesaData {
  descricao: string
  valor: number
  data_vencimento: string
  data_pagamento?: string
  categoria?: string
  status?: 'pendente' | 'pago' | 'vencido'
  observacoes?: string
}

export const despesasService = {
  async getAll(month?: string, year?: string): Promise<Despesa[]> {
    const params = new URLSearchParams()
    if (month) params.append('month', month)
    if (year) params.append('year', year)
    
    const response = await api.get(`/despesas?${params.toString()}`)
    return response.data
  },

  async getById(id: string): Promise<Despesa> {
    const response = await api.get(`/despesas/${id}`)
    return response.data
  },

  async create(data: CreateDespesaData): Promise<Despesa> {
    const response = await api.post('/despesas', data)
    return response.data
  },

  async update(id: string, data: Partial<CreateDespesaData>): Promise<Despesa> {
    const response = await api.patch(`/despesas/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/despesas/${id}`)
  },

  async updateOverdueStatus(): Promise<{ message: string; updated: number }> {
    const response = await api.post('/despesas/update-overdue')
    return response.data
  }
}
