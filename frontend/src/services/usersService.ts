import api from './api'

export interface User {
  id: string
  email: string
  name: string
  telegram_id?: string
  sharing_code: string
  created_at: string
  updated_at: string
}

export interface UpdateProfileDto {
  name?: string
  telegram_id?: string
}

export const usersService = {
  async getProfile(): Promise<User> {
    const response = await api.get('/users/profile')
    return response.data
  },

  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await api.put('/users/profile', data)
    return response.data
  },

  async getUserBySharingCode(sharingCode: string): Promise<User> {
    const response = await api.get(`/users/sharing/${sharingCode}`)
    return response.data
  }
}
