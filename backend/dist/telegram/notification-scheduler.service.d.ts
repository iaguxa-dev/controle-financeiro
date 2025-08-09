import { TelegramService } from './telegram.service';
export declare class NotificationSchedulerService {
    private telegramService;
    constructor(telegramService: TelegramService);
    sendDailyExpenseNotifications(): Promise<void>;
    sendMonthlyInvoiceNotifications(): Promise<void>;
}
