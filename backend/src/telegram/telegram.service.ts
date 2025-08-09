import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    private configService: ConfigService,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (token) {
      this.bot = new TelegramBot(token, { polling: true });
    }
  }

  // Função utilitária para formatar datas corretamente (evita problemas de timezone)
  private formatDateBR(dateString: string): string {
    // Assume que a data está no formato YYYY-MM-DD do banco
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  onModuleInit() {
    if (this.bot) {
      this.setupCommands();
      console.log('🤖 Telegram Bot iniciado com sucesso!');
    } else {
      console.warn('⚠️ Telegram Bot não iniciado - token não configurado');
    }
  }

  private setupCommands() {
    // Comando /start
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const welcomeMessage = `
🎉 *Bem-vindo ao Bot de Controle Financeiro!*

Este bot enviará notificações sobre:
• 📅 Vencimentos de despesas
• 💳 Faturas próximas do vencimento
• 💰 Lembretes financeiros

*Como configurar:*
1. Digite /id para obter seu ID
2. Copie o ID e cole no seu perfil no app
3. Pronto! Você receberá notificações automáticas

*Comandos disponíveis:*
/start - Mostrar esta mensagem
/id - Obter seu Telegram ID
/help - Ajuda
      `;
      
      this.bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
    });

    // Comando /id
    this.bot.onText(/\/id/, (msg) => {
      const chatId = msg.chat.id;
      const message = `
🆔 *Seu Telegram ID é:*

\`${chatId}\`

📋 *Como usar:*
1. Copie o ID acima (toque para selecionar)
2. Vá para seu perfil no app
3. Cole este ID no campo "Telegram ID"
4. Salve as configurações

✅ Após isso, você receberá notificações automáticas!
      `;
      
      this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    });

    // Comando /help
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      const helpMessage = `
📚 *Ajuda - Bot Controle Financeiro*

*Comandos:*
/start - Mensagem de boas-vindas
/id - Obter seu Telegram ID
/help - Esta mensagem de ajuda

*Notificações automáticas:*
• 🔔 Despesas vencendo em 3 dias
• 🔔 Despesas vencendo hoje
• 🔔 Despesas vencidas
• 💳 Faturas próximas do vencimento

*Configuração:*
1. Use /id para obter seu ID
2. Configure no app: Perfil > Telegram ID
3. Salve e pronto!

*Dúvidas?*
Entre em contato através do app.
      `;
      
      this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    });

    // Resposta para mensagens não reconhecidas
    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;
      
      // Ignorar se for um comando conhecido
      if (text?.startsWith('/start') || text?.startsWith('/id') || text?.startsWith('/help')) {
        return;
      }
      
      const message = `
❓ Comando não reconhecido.

Digite /help para ver os comandos disponíveis.
      `;
      
      this.bot.sendMessage(chatId, message);
    });
  }

  // Enviar notificação para um usuário específico
  async sendNotification(telegramId: string, message: string) {
    if (!this.bot) {
      console.warn('Bot do Telegram não está configurado');
      return false;
    }

    try {
      await this.bot.sendMessage(telegramId, message, { parse_mode: 'Markdown' });
      console.log(`✅ Notificação enviada para ${telegramId}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao enviar notificação para ${telegramId}:`, error.message);
      return false;
    }
  }

  // Notificar vencimento de despesa
  async notifyExpensesDue() {
    console.log('🔍 Verificando despesas para notificação...');
    
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const todayStr = today.toISOString().split('T')[0];
    const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0];

    try {
      // Buscar despesas vencendo em até 3 dias
      const { data: expenses, error } = await this.supabase
        .from('despesas')
        .select(`
          *,
          users (name, email, telegram_id)
        `)
        .eq('status', 'pendente')
        .gte('data_vencimento', todayStr)
        .lte('data_vencimento', threeDaysStr);

      if (error) {
        console.error('Erro ao buscar despesas:', error);
        return;
      }

      // Agrupar por usuário
      const userExpenses = new Map();
      
      expenses?.forEach(expense => {
        if (expense.users?.telegram_id) {
          const userId = expense.user_id;
          if (!userExpenses.has(userId)) {
            userExpenses.set(userId, {
              user: expense.users,
              expenses: []
            });
          }
          userExpenses.get(userId).expenses.push(expense);
        }
      });

      // Enviar notificações
      for (const [userId, data] of userExpenses) {
        const { user, expenses: userExpenseList } = data;
        let message = `🔔 *Lembretes de Vencimento*\n\n`;

        const today = new Date().toISOString().split('T')[0];
        const todayExpenses = userExpenseList.filter(e => e.data_vencimento === today);
        const upcomingExpenses = userExpenseList.filter(e => e.data_vencimento > today);

        if (todayExpenses.length > 0) {
          const today = new Date();
          const todayFormatted = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
          message += `⚠️ *VENCEM HOJE (${todayFormatted}):*\n`;
          todayExpenses.forEach(expense => {
            message += `• ${expense.descricao} - R$ ${parseFloat(expense.valor).toFixed(2)}\n`;
          });
          message += '\n';
        }

        if (upcomingExpenses.length > 0) {
          message += `📅 *Próximos vencimentos:*\n`;
          upcomingExpenses.forEach(expense => {
            message += `• ${expense.descricao} - R$ ${parseFloat(expense.valor).toFixed(2)}\n`;
            message += `  📅 ${this.formatDateBR(expense.data_vencimento)}\n`;
          });
        }

        message += `\n💡 *Acesse o app para gerenciar suas finanças*`;

        await this.sendNotification(user.telegram_id, message);
      }

      console.log(`✅ Verificação de despesas concluída. ${userExpenses.size} usuários notificados.`);
    } catch (error) {
      console.error('Erro ao enviar notificações de despesas:', error);
    }
  }

  // Notificar faturas próximas do vencimento
  async notifyInvoicesDue() {
    console.log('🔍 Verificando faturas para notificação...');
    
    try {
      // Buscar usuários com faturas (sem data específica, apenas para lembrete geral)
      const { data: users, error } = await this.supabase
        .from('users')
        .select('id, name, email, telegram_id')
        .not('telegram_id', 'is', null);

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        return;
      }

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const competencia = `${currentMonth.toString().padStart(2, '0')}/${currentYear}`;

      for (const user of users || []) {
        // Buscar faturas do usuário para o mês atual
        const { data: invoices, error: invoicesError } = await this.supabase
          .from('faturas')
          .select('*')
          .eq('user_id', user.id)
          .eq('competencia', competencia);

        if (!invoicesError && invoices && invoices.length > 0) {
          const totalValue = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.valor), 0);
          
          const message = `
💳 *Lembrete de Faturas - ${competencia}*

📊 *Resumo do mês:*
• Total de transações: ${invoices.length}
• Valor total: R$ ${totalValue.toFixed(2)}

💡 *Acesse o app para:*
• Revisar suas faturas
• Categorizar gastos
• Planejar próximos meses

🔗 *Não esqueça de organizar suas finanças!*
          `;

          await this.sendNotification(user.telegram_id, message);
        }
      }

      console.log('✅ Verificação de faturas concluída.');
    } catch (error) {
      console.error('Erro ao enviar notificações de faturas:', error);
    }
  }

  // Notificar quando uma nova despesa é criada
  async notifyNewExpense(userId: string, expense: any) {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .select('name, telegram_id')
        .eq('id', userId)
        .single();

      if (error || !user?.telegram_id) return;

      const message = `
💸 *Nova Despesa Adicionada*

📝 *Descrição:* ${expense.descricao}
💰 *Valor:* R$ ${parseFloat(expense.valor).toFixed(2)}
📅 *Vencimento:* ${this.formatDateBR(expense.data_vencimento)}
🏷️ *Categoria:* ${expense.categoria || 'Sem categoria'}

🔔 *Lembrete configurado para próximo ao vencimento!*
      `;

      await this.sendNotification(user.telegram_id, message);
    } catch (error) {
      console.error('Erro ao notificar nova despesa:', error);
    }
  }

  // Notificar quando uma nova receita é criada
  async notifyNewIncome(userId: string, income: any) {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .select('name, telegram_id')
        .eq('id', userId)
        .single();

      if (error || !user?.telegram_id) return;

      const message = `
💰 *Nova Receita Adicionada*

📝 *Descrição:* ${income.descricao}
💚 *Valor:* R$ ${parseFloat(income.valor).toFixed(2)}
📅 *Data de Recebimento:* ${this.formatDateBR(income.data_recebimento)}
🏷️ *Categoria:* ${income.categoria || 'Sem categoria'}

✅ *Receita registrada com sucesso!*
      `;

      await this.sendNotification(user.telegram_id, message);
    } catch (error) {
      console.error('Erro ao notificar nova receita:', error);
    }
  }

  // Notificar quando uma despesa é marcada como paga
  async notifyExpensePaid(userId: string, expense: any) {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .select('name, telegram_id')
        .eq('id', userId)
        .single();

      if (error || !user?.telegram_id) return;

      const message = `
✅ *Despesa Paga*

📝 *Descrição:* ${expense.descricao}
💰 *Valor:* R$ ${parseFloat(expense.valor).toFixed(2)}
📅 *Pago em:* ${this.formatDateBR(expense.data_pagamento)}

🎉 *Parabéns por manter suas finanças em dia!*
      `;

      await this.sendNotification(user.telegram_id, message);
    } catch (error) {
      console.error('Erro ao notificar pagamento de despesa:', error);
    }
  }

  // Notificar quando faturas são importadas
  async notifyInvoicesImported(userId: string, invoicesCount: number, totalValue: number, competencia: string) {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .select('name, telegram_id')
        .eq('id', userId)
        .single();

      if (error || !user?.telegram_id) return;

      const message = `
💳 *Faturas Importadas*

📊 *Competência:* ${competencia}
📈 *Transações:* ${invoicesCount} itens
💰 *Valor Total:* R$ ${totalValue.toFixed(2)}

💡 *Acesse o app para revisar e categorizar os gastos!*
      `;

      await this.sendNotification(user.telegram_id, message);
    } catch (error) {
      console.error('Erro ao notificar importação de faturas:', error);
    }
  }
}
