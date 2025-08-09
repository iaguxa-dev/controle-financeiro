import api from './api'

export interface Receita {
  id: string
  user_id: string
  descricao: string
  valor: number
  data_recebimento: string
  categoria?: string
  observacoes?: string
  created_at: string
  updated_at: string
  is_own?: boolean
  owner_name?: string
  owner_email?: string
}

export interface CreateReceitaData {
  descricao: string
  valor: number
  data_recebimento: string
  categoria?: string
  observacoes?: string
}

export const receitasService = {
  async getAll(month?: string, year?: string): Promise<Receita[]> {
    const params = new URLSearchParams()
    if (month) params.append('month', month)
    if (year) params.append('year', year)
    
    const response = await api.get(`/receitas?${params.toString()}`)
    return response.data
  },

  async getById(id: string): Promise<Receita> {
    const response = await api.get(`/receitas/${id}`)
    return response.data
  },

  async create(data: CreateReceitaData): Promise<Receita> {
    const response = await api.post('/receitas', data)
    return response.data
  },

  async update(id: string, data: Partial<CreateReceitaData>): Promise<Receita> {
    const response = await api.patch(`/receitas/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/receitas/${id}`)
  }
}
