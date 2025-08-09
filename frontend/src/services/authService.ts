import api from './api'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  telegram_id?: string
}

export interface RecoverPasswordData {
  email: string
}

export const authService = {
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  recoverPassword: async (data: RecoverPasswordData) => {
    const response = await api.post('/auth/recover', data)
    return response.data
  },
}
