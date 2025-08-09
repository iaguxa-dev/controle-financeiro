import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelegramService } from './telegram.service';

@Injectable()
export class NotificationSchedulerService {
  constructor(private telegramService: TelegramService) {}

  // Executar todos os dias às 9:00 da manhã
  @Cron('0 9 * * *')
  async sendDailyExpenseNotifications() {
    console.log('🔔 Iniciando envio de notificações diárias de despesas...');
    await this.telegramService.notifyExpensesDue();
  }

  // Executar no primeiro dia de cada mês às 10:00
  @Cron('0 10 1 * *')
  async sendMonthlyInvoiceNotifications() {
    console.log('🔔 Iniciando envio de notificações mensais de faturas...');
    await this.telegramService.notifyInvoicesDue();
  }

  // Para testes: executar a cada 5 minutos (descomente para testar)
  // @Cron('*/5 * * * *')
  // async testNotifications() {
  //   console.log('🧪 Testando notificações...');
  //   await this.telegramService.notifyExpensesDue();
  // }
}
