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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const telegram_service_1 = require("./telegram.service");
let NotificationSchedulerService = class NotificationSchedulerService {
    constructor(telegramService) {
        this.telegramService = telegramService;
    }
    async sendDailyExpenseNotifications() {
        console.log('🔔 Iniciando envio de notificações diárias de despesas...');
        await this.telegramService.notifyExpensesDue();
    }
    async sendMonthlyInvoiceNotifications() {
        console.log('🔔 Iniciando envio de notificações mensais de faturas...');
        await this.telegramService.notifyInvoicesDue();
    }
};
exports.NotificationSchedulerService = NotificationSchedulerService;
__decorate([
    (0, schedule_1.Cron)('0 9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationSchedulerService.prototype, "sendDailyExpenseNotifications", null);
__decorate([
    (0, schedule_1.Cron)('0 10 1 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationSchedulerService.prototype, "sendMonthlyInvoiceNotifications", null);
exports.NotificationSchedulerService = NotificationSchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [telegram_service_1.TelegramService])
], NotificationSchedulerService);
//# sourceMappingURL=notification-scheduler.service.js.map