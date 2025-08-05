import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { TransactionsModule } from "./transactions/transactions.module"
import { InvoicesModule } from "./invoices/invoices.module"
import { ReportsModule } from "./reports/reports.module"
import { NotificationsModule } from "./notifications/notifications.module"
import { ShareModule } from "./share/share.module"
import { TransportModule } from "./transport/transport.module"
import { SupabaseModule } from "./supabase/supabase.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    TransactionsModule,
    InvoicesModule,
    ReportsModule,
    NotificationsModule,
    ShareModule,
    TransportModule,
  ],
})
export class AppModule {}
