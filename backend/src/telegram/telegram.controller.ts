import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TelegramService } from './telegram.service';

@Controller('telegram')
@UseGuards(JwtAuthGuard)
export class TelegramController {
  constructor(private telegramService: TelegramService) {}

  @Post('test-notification')
  async testNotification(@Request() req, @Body() body: { message?: string }) {
    const user = req.user;
    const message = body.message || '🧪 Esta é uma notificação de teste do seu bot financeiro!';
    
    // Buscar dados completos do usuário para obter o telegram_id
    const result = await this.telegramService['supabase']
      .from('users')
      .select('telegram_id')
      .eq('id', user.userId)
      .single();

    if (result.error || !result.data?.telegram_id) {
      return {
        success: false,
        message: 'Telegram ID não configurado. Configure seu Telegram ID no perfil primeiro.'
      };
    }

    const sent = await this.telegramService.sendNotification(result.data.telegram_id, message);
    
    return {
      success: sent,
      message: sent ? 'Notificação enviada com sucesso!' : 'Erro ao enviar notificação'
    };
  }

  @Post('test-expenses')
  async testExpenseNotifications() {
    await this.telegramService.notifyExpensesDue();
    return {
      success: true,
      message: 'Verificação de despesas iniciada'
    };
  }

  @Post('test-invoices')
  async testInvoiceNotifications() {
    await this.telegramService.notifyInvoicesDue();
    return {
      success: true,
      message: 'Verificação de faturas iniciada'
    };
  }
}
