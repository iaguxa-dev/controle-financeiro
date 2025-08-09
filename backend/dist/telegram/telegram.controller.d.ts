import { TelegramService } from './telegram.service';
export declare class TelegramController {
    private telegramService;
    constructor(telegramService: TelegramService);
    testNotification(req: any, body: {
        message?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    testExpenseNotifications(): Promise<{
        success: boolean;
        message: string;
    }>;
    testInvoiceNotifications(): Promise<{
        success: boolean;
        message: string;
    }>;
}
