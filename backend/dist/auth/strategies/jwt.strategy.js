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
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, supabase) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
        });
        this.supabase = supabase;
    }
    async validate(payload) {
        const userId = payload.sub;
        try {
            const { data: currentUser, error: userError } = await this.supabase
                .from('users')
                .select('id, sharing_code, name, email')
                .eq('id', userId)
                .single();
            if (userError || !currentUser) {
                return { userId, email: payload.email, sharedUserIds: [userId], sharedUsers: [] };
            }
            const { data: connections, error: connectionsError } = await this.supabase
                .from('compartilhamentos')
                .select(`
          owner_id,
          shared_with_id,
          owner:users!compartilhamentos_owner_id_fkey (id, name, email),
          shared_with:users!compartilhamentos_shared_with_id_fkey (id, name, email)
        `)
                .or(`owner_id.eq.${userId},shared_with_id.eq.${userId}`);
            const sharedUsers = [currentUser];
            const sharedUserIds = [userId];
            if (connections && !connectionsError) {
                connections.forEach((connection) => {
                    if (connection.owner_id === userId && connection.shared_with) {
                        sharedUsers.push(connection.shared_with);
                        sharedUserIds.push(connection.shared_with.id);
                    }
                    else if (connection.shared_with_id === userId && connection.owner) {
                        sharedUsers.push(connection.owner);
                        sharedUserIds.push(connection.owner.id);
                    }
                });
            }
            return {
                userId: currentUser.id,
                email: payload.email,
                sharing_code: currentUser.sharing_code,
                sharedUserIds,
                sharedUsers
            };
        }
        catch (error) {
            return { userId, email: payload.email, sharedUserIds: [userId], sharedUsers: [] };
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [config_1.ConfigService,
        supabase_js_1.SupabaseClient])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map