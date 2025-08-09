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
exports.DespesasController = void 0;
const common_1 = require("@nestjs/common");
const despesas_service_1 = require("./despesas.service");
const create_despesa_dto_1 = require("./dto/create-despesa.dto");
const update_despesa_dto_1 = require("./dto/update-despesa.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let DespesasController = class DespesasController {
    constructor(despesasService) {
        this.despesasService = despesasService;
    }
    create(req, createDespesaDto) {
        return this.despesasService.create(req.user.userId, createDespesaDto);
    }
    findAll(req, month, year) {
        return this.despesasService.findAll(req.user.userId, month, year, req.user.sharedUserIds);
    }
    findOne(req, id) {
        return this.despesasService.findOne(req.user.userId, id, req.user.sharedUserIds);
    }
    update(req, id, updateDespesaDto) {
        return this.despesasService.update(req.user.userId, id, updateDespesaDto, req.user.sharedUserIds);
    }
    remove(req, id) {
        return this.despesasService.remove(req.user.userId, id, req.user.sharedUserIds);
    }
    updateOverdueStatus(req) {
        return this.despesasService.updateOverdueStatus(req.user.userId, req.user.sharedUserIds);
    }
};
exports.DespesasController = DespesasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_despesa_dto_1.CreateDespesaDto]),
    __metadata("design:returntype", void 0)
], DespesasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], DespesasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DespesasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_despesa_dto_1.UpdateDespesaDto]),
    __metadata("design:returntype", void 0)
], DespesasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DespesasController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('update-overdue'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DespesasController.prototype, "updateOverdueStatus", null);
exports.DespesasController = DespesasController = __decorate([
    (0, common_1.Controller)('despesas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [despesas_service_1.DespesasService])
], DespesasController);
//# sourceMappingURL=despesas.controller.js.map