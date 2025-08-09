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
exports.TelegramController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const telegram_service_1 = require("./telegram.service");
let TelegramController = class TelegramController {
    constructor(telegramService) {
        this.telegramService = telegramService;
    }
    async testNotification(req, body) {
        const user = req.user;
        const message = body.message || '🧪 Esta é uma notificação de teste do seu bot financeiro!';
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
    async testExpenseNotifications() {
        await this.telegramService.notifyExpensesDue();
        return {
            success: true,
            message: 'Verificação de despesas iniciada'
        };
    }
    async testInvoiceNotifications() {
        await this.telegramService.notifyInvoicesDue();
        return {
            success: true,
            message: 'Verificação de faturas iniciada'
        };
    }
};
exports.TelegramController = TelegramController;
__decorate([
    (0, common_1.Post)('test-notification'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "testNotification", null);
__decorate([
    (0, common_1.Post)('test-expenses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "testExpenseNotifications", null);
__decorate([
    (0, common_1.Post)('test-invoices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "testInvoiceNotifications", null);
exports.TelegramController = TelegramController = __decorate([
    (0, common_1.Controller)('telegram'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [telegram_service_1.TelegramService])
], TelegramController);
//# sourceMappingURL=telegram.controller.js.map