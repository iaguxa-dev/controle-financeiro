"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const TelegramBot = require("node-telegram-bot-api");
let TelegramService = class TelegramService {
    constructor(configService, supabase) {
        this.configService = configService;
        this.supabase = supabase;
        const token = this.configService.get('TELEGRAM_BOT_TOKEN');
        if (token) {
            this.bot = new TelegramBot(token, { polling: true });
        }
    }
    formatDateBR(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
    onModuleInit() {
        if (this.bot) {
            this.setupCommands();
            console.log('🤖 Telegram Bot iniciado com sucesso!');
        }
        else {
            console.warn('⚠️ Telegram Bot não iniciado - token não configurado');
        }
    }
    setupCommands() {
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
        this.bot.on('message', (msg) => {
            const chatId = msg.chat.id;
            const text = msg.text;
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
    async sendNotification(telegramId, message) {
        if (!this.bot) {
            console.warn('Bot do Telegram não está configurado');
            return false;
        }
        try {
            await this.bot.sendMessage(telegramId, message, { parse_mode: 'Markdown' });
            console.log(`✅ Notificação enviada para ${telegramId}`);
            return true;
        }
        catch (error) {
            console.error(`❌ Erro ao enviar notificação para ${telegramId}:`, error.message);
            return false;
        }
    }
    async notifyExpensesDue() {
        console.log('🔍 Verificando despesas para notificação...');
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);
        const todayStr = today.toISOString().split('T')[0];
        const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0];
        try {
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
        }
        catch (error) {
            console.error('Erro ao enviar notificações de despesas:', error);
        }
    }
    async notifyInvoicesDue() {
        console.log('🔍 Verificando faturas para notificação...');
        try {
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
        }
        catch (error) {
            console.error('Erro ao enviar notificações de faturas:', error);
        }
    }
    async notifyNewExpense(userId, expense) {
        try {
            const { data: user, error } = await this.supabase
                .from('users')
                .select('name, telegram_id')
                .eq('id', userId)
                .single();
            if (error || !user?.telegram_id)
                return;
            const message = `
💸 *Nova Despesa Adicionada*

📝 *Descrição:* ${expense.descricao}
💰 *Valor:* R$ ${parseFloat(expense.valor).toFixed(2)}
📅 *Vencimento:* ${this.formatDateBR(expense.data_vencimento)}
🏷️ *Categoria:* ${expense.categoria || 'Sem categoria'}

🔔 *Lembrete configurado para próximo ao vencimento!*
      `;
            await this.sendNotification(user.telegram_id, message);
        }
        catch (error) {
            console.error('Erro ao notificar nova despesa:', error);
        }
    }
    async notifyNewIncome(userId, income) {
        try {
            const { data: user, error } = await this.supabase
                .from('users')
                .select('name, telegram_id')
                .eq('id', userId)
                .single();
            if (error || !user?.telegram_id)
                return;
            const message = `
💰 *Nova Receita Adicionada*

📝 *Descrição:* ${income.descricao}
💚 *Valor:* R$ ${parseFloat(income.valor).toFixed(2)}
📅 *Data de Recebimento:* ${this.formatDateBR(income.data_recebimento)}
🏷️ *Categoria:* ${income.categoria || 'Sem categoria'}

✅ *Receita registrada com sucesso!*
      `;
            await this.sendNotification(user.telegram_id, message);
        }
        catch (error) {
            console.error('Erro ao notificar nova receita:', error);
        }
    }
    async notifyExpensePaid(userId, expense) {
        try {
            const { data: user, error } = await this.supabase
                .from('users')
                .select('name, telegram_id')
                .eq('id', userId)
                .single();
            if (error || !user?.telegram_id)
                return;
            const message = `
✅ *Despesa Paga*

📝 *Descrição:* ${expense.descricao}
💰 *Valor:* R$ ${parseFloat(expense.valor).toFixed(2)}
📅 *Pago em:* ${this.formatDateBR(expense.data_pagamento)}

🎉 *Parabéns por manter suas finanças em dia!*
      `;
            await this.sendNotification(user.telegram_id, message);
        }
        catch (error) {
            console.error('Erro ao notificar pagamento de despesa:', error);
        }
    }
    async notifyInvoicesImported(userId, invoicesCount, totalValue, competencia) {
        try {
            const { data: user, error } = await this.supabase
                .from('users')
                .select('name, telegram_id')
                .eq('id', userId)
                .single();
            if (error || !user?.telegram_id)
                return;
            const message = `
💳 *Faturas Importadas*

📊 *Competência:* ${competencia}
📈 *Transações:* ${invoicesCount} itens
💰 *Valor Total:* R$ ${totalValue.toFixed(2)}

💡 *Acesse o app para revisar e categorizar os gastos!*
      `;
            await this.sendNotification(user.telegram_id, message);
        }
        catch (error) {
            console.error('Erro ao notificar importação de faturas:', error);
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [config_1.ConfigService,
        supabase_js_1.SupabaseClient])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map