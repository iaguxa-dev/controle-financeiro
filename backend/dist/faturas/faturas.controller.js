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
exports.FaturasController = void 0;
const common_1 = require("@nestjs/common");
const faturas_service_1 = require("./faturas.service");
const create_fatura_dto_1 = require("./dto/create-fatura.dto");
const create_fatura_batch_dto_1 = require("./dto/create-fatura-batch.dto");
const update_fatura_dto_1 = require("./dto/update-fatura.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let FaturasController = class FaturasController {
    constructor(faturasService) {
        this.faturasService = faturasService;
    }
    create(req, createFaturaDto) {
        return this.faturasService.create(req.user.userId, createFaturaDto);
    }
    createBatch(req, createFaturaBatchDto) {
        return this.faturasService.createBatch(req.user.userId, createFaturaBatchDto);
    }
    findAll(req, competencia) {
        return this.faturasService.findAll(req.user.userId, competencia, req.user.sharedUserIds);
    }
    findOne(req, id) {
        return this.faturasService.findOne(req.user.userId, id, req.user.sharedUserIds);
    }
    update(req, id, updateFaturaDto) {
        return this.faturasService.update(req.user.userId, id, updateFaturaDto, req.user.sharedUserIds);
    }
    remove(req, id) {
        return this.faturasService.remove(req.user.userId, id, req.user.sharedUserIds);
    }
};
exports.FaturasController = FaturasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_fatura_dto_1.CreateFaturaDto]),
    __metadata("design:returntype", void 0)
], FaturasController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('batch'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_fatura_batch_dto_1.CreateFaturaBatchDto]),
    __metadata("design:returntype", void 0)
], FaturasController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('competencia')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FaturasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FaturasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_fatura_dto_1.UpdateFaturaDto]),
    __metadata("design:returntype", void 0)
], FaturasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FaturasController.prototype, "remove", null);
exports.FaturasController = FaturasController = __decorate([
    (0, common_1.Controller)('faturas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [faturas_service_1.FaturasService])
], FaturasController);
//# sourceMappingURL=faturas.controller.js.map