import { Injectable } from "@nestjs/common"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { ConfigService } from "@nestjs/config"

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient

  constructor(private configService: ConfigService) {
    this.supabase = createClient(this.configService.get("SUPABASE_URL"), this.configService.get("SUPABASE_SERVICE_KEY"))
  }

  getClient(): SupabaseClient {
    return this.supabase
  }

  async createUser(email: string, password: string, metadata?: any) {
    return this.supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: metadata,
    })
  }

  async getUserById(id: string) {
    return this.supabase.auth.admin.getUserById(id)
  }
}
