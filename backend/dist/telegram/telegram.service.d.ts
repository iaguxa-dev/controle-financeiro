import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class TelegramService implements OnModuleInit {
    private configService;
    private supabase;
    private bot;
    constructor(configService: ConfigService, supabase: SupabaseClient);
    private formatDateBR;
    onModuleInit(): void;
    private setupCommands;
    sendNotification(telegramId: string, message: string): Promise<boolean>;
    notifyExpensesDue(): Promise<void>;
    notifyInvoicesDue(): Promise<void>;
    notifyNewExpense(userId: string, expense: any): Promise<void>;
    notifyNewIncome(userId: string, income: any): Promise<void>;
    notifyExpensePaid(userId: string, expense: any): Promise<void>;
    notifyInvoicesImported(userId: string, invoicesCount: number, totalValue: number, competencia: string): Promise<void>;
}
