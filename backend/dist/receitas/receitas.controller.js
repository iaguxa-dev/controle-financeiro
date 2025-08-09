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
exports.ReceitasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const receitas_service_1 = require("./receitas.service");
const create_receita_dto_1 = require("./dto/create-receita.dto");
const update_receita_dto_1 = require("./dto/update-receita.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ReceitasController = class ReceitasController {
    constructor(receitasService) {
        this.receitasService = receitasService;
    }
    create(req, createReceitaDto) {
        return this.receitasService.create(req.user.userId, createReceitaDto);
    }
    findAll(req, month, year) {
        return this.receitasService.findAll(req.user.userId, month, year, req.user.sharedUserIds);
    }
    getTotalByMonth(req, month, year) {
        return this.receitasService.getTotalByMonth(req.user.userId, month, year, req.user.sharedUserIds);
    }
    findOne(req, id) {
        return this.receitasService.findOne(req.user.userId, id, req.user.sharedUserIds);
    }
    update(req, id, updateReceitaDto) {
        return this.receitasService.update(req.user.userId, id, updateReceitaDto, req.user.sharedUserIds);
    }
    remove(req, id) {
        return this.receitasService.remove(req.user.userId, id, req.user.sharedUserIds);
    }
};
exports.ReceitasController = ReceitasController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova receita' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_receita_dto_1.CreateReceitaDto]),
    __metadata("design:returntype", void 0)
], ReceitasController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as receitas' }),
    (0, swagger_1.ApiQuery)({ name: 'month', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ReceitasController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Total de receitas por mês' }),
    (0, common_1.Get)('total/:month/:year'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('month')),
    __param(2, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ReceitasController.prototype, "getTotalByMonth", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter receita por ID' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReceitasController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar receita' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_receita_dto_1.UpdateReceitaDto]),
    __metadata("design:returntype", void 0)
], ReceitasController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Deletar receita' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReceitasController.prototype, "remove", null);
exports.ReceitasController = ReceitasController = __decorate([
    (0, swagger_1.ApiTags)('receitas'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('receitas'),
    __metadata("design:paramtypes", [receitas_service_1.ReceitasService])
], ReceitasController);
//# sourceMappingURL=receitas.controller.js.map