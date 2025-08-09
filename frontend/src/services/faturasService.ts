import api from './api'

export interface Fatura {
  id: string
  user_id: string
  banco: string
  competencia: string
  estabelecimento: string
  valor: number
  data_transacao?: string
  categoria?: string
  observacoes?: string
  created_at: string
  updated_at: string
  is_own?: boolean
  owner_name?: string
  owner_email?: string
}

export interface CreateFaturaData {
  banco: string
  competencia: string
  estabelecimento: string
  valor: number
  data_transacao?: string
  categoria?: string
  observacoes?: string
}

export interface ImportFaturaData {
  faturas: CreateFaturaData[]
}

export const faturasService = {
  async getAll(competencia?: string): Promise<Fatura[]> {
    const params = new URLSearchParams()
    if (competencia) params.append('competencia', competencia)
    
    const response = await api.get(`/faturas?${params.toString()}`)
    return response.data
  },

  async getById(id: string): Promise<Fatura> {
    const response = await api.get(`/faturas/${id}`)
    return response.data
  },

  async create(data: CreateFaturaData): Promise<Fatura> {
    const response = await api.post('/faturas', data)
    return response.data
  },

  async createBatch(data: ImportFaturaData): Promise<Fatura[]> {
    const response = await api.post('/faturas/batch', data)
    return response.data
  },

  async update(id: string, data: Partial<CreateFaturaData>): Promise<Fatura> {
    const response = await api.patch(`/faturas/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/faturas/${id}`)
  },

  async getResumo(): Promise<any[]> {
    const response = await api.get('/faturas/resumo')
    return response.data
  }
}
