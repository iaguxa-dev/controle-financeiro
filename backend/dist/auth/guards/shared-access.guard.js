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
exports.SharedAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const supabase_js_1 = require("@supabase/supabase-js");
const common_2 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SharedAccessGuard = class SharedAccessGuard {
    constructor(reflector, jwtService, supabase, configService) {
        this.reflector = reflector;
        this.jwtService = jwtService;
        this.supabase = supabase;
        this.configService = configService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.ForbiddenException('Token não fornecido');
        }
        try {
            const secret = this.configService.get('JWT_SECRET') || 'your-secret-key';
            const payload = this.jwtService.verify(token, { secret });
            const userId = payload.sub || payload.userId;
            if (!userId) {
                throw new common_1.ForbiddenException('ID do usuário não encontrado no token');
            }
            const { data: currentUser, error: userError } = await this.supabase
                .from('users')
                .select('id, sharing_code')
                .eq('id', userId)
                .single();
            if (userError || !currentUser) {
                throw new common_1.ForbiddenException('Usuário não encontrado');
            }
            const { data: sharedUsers, error: sharedError } = await this.supabase
                .from('users')
                .select('id, name, email')
                .eq('sharing_code', currentUser.sharing_code);
            if (sharedError) {
                throw new common_1.ForbiddenException('Erro ao buscar usuários compartilhados');
            }
            request.user = {
                userId: currentUser.id,
                sharing_code: currentUser.sharing_code,
                sharedUserIds: sharedUsers.map(u => u.id),
                sharedUsers: sharedUsers
            };
            return true;
        }
        catch (error) {
            if (error.name === 'JsonWebTokenError') {
                throw new common_1.ForbiddenException('Token JWT inválido');
            }
            if (error.name === 'TokenExpiredError') {
                throw new common_1.ForbiddenException('Token JWT expirado');
            }
            throw new common_1.ForbiddenException('Erro na validação do token: ' + error.message);
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.SharedAccessGuard = SharedAccessGuard;
exports.SharedAccessGuard = SharedAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_2.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService,
        supabase_js_1.SupabaseClient,
        config_1.ConfigService])
], SharedAccessGuard);
//# sourceMappingURL=shared-access.guard.js.map