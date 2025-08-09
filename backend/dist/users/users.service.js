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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
let UsersService = class UsersService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async create(createUserDto) {
        const { data: existingUser } = await this.supabase
            .from('users')
            .select('id')
            .eq('email', createUserDto.email)
            .single();
        if (existingUser) {
            throw new common_1.ConflictException('Email já está em uso');
        }
        const { data, error } = await this.supabase
            .from('users')
            .insert({
            email: createUserDto.email,
            name: createUserDto.name,
            password_hash: createUserDto.password,
            telegram_id: createUserDto.telegram_id,
        })
            .select()
            .single();
        if (error) {
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        }
        return data;
    }
    async findByEmail(email) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error && error.code !== 'PGRST116') {
            throw new Error(`Erro ao buscar usuário: ${error.message}`);
        }
        return data;
    }
    async findById(id) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            throw new Error(`Erro ao buscar usuário: ${error.message}`);
        }
        return data;
    }
    async findBySharingCode(sharingCode) {
        const { data, error } = await this.supabase
            .from('users')
            .select('id, name, email, sharing_code')
            .eq('sharing_code', sharingCode)
            .single();
        if (error && error.code !== 'PGRST116') {
            throw new Error(`Erro ao buscar usuário: ${error.message}`);
        }
        return data;
    }
    async update(id, updateUserDto) {
        const { data, error } = await this.supabase
            .from('users')
            .update(updateUserDto)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(`Erro ao atualizar usuário: ${error.message}`);
        }
        return data;
    }
    async connectWithSharingCode(userId, sharingCode) {
        const { data: targetUser, error: targetError } = await this.supabase
            .from('users')
            .select('*')
            .eq('sharing_code', sharingCode)
            .single();
        if (targetError || !targetUser) {
            throw new Error('Código de compartilhamento inválido');
        }
        const { data: currentUser, error: currentError } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (currentError || !currentUser) {
            throw new Error('Usuário atual não encontrado');
        }
        const { data: existingConnection } = await this.supabase
            .from('compartilhamentos')
            .select('*')
            .or(`and(owner_id.eq.${userId},shared_with_id.eq.${targetUser.id}),and(owner_id.eq.${targetUser.id},shared_with_id.eq.${userId})`)
            .single();
        if (existingConnection) {
            throw new Error('Vocês já estão conectados');
        }
        const { error: error1 } = await this.supabase
            .from('compartilhamentos')
            .insert({
            owner_id: userId,
            shared_with_id: targetUser.id,
            can_edit: true
        });
        const { error: error2 } = await this.supabase
            .from('compartilhamentos')
            .insert({
            owner_id: targetUser.id,
            shared_with_id: userId,
            can_edit: true
        });
        if (error1 || error2) {
            throw new Error(`Erro ao conectar contas: ${error1?.message || error2?.message}`);
        }
        return {
            message: 'Contas conectadas com sucesso',
            connectedUserName: targetUser.name,
            connectedUserEmail: targetUser.email,
            sharedCode: targetUser.sharing_code
        };
    }
    async getUsersBySharingCode(sharingCode) {
        const { data: owner, error: ownerError } = await this.supabase
            .from('users')
            .select('id, name, email, sharing_code')
            .eq('sharing_code', sharingCode)
            .single();
        if (ownerError || !owner) {
            throw new Error(`Código de compartilhamento inválido: ${ownerError?.message}`);
        }
        const { data: connections, error: connectionsError } = await this.supabase
            .from('compartilhamentos')
            .select(`
        shared_with_id,
        users!compartilhamentos_shared_with_id_fkey (
          id, name, email, sharing_code
        )
      `)
            .eq('owner_id', owner.id);
        if (connectionsError) {
            throw new Error(`Erro ao buscar conexões: ${connectionsError.message}`);
        }
        const connectedUsers = [owner];
        if (connections) {
            connections.forEach((connection) => {
                if (connection.users) {
                    connectedUsers.push(connection.users);
                }
            });
        }
        return connectedUsers;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], UsersService);
//# sourceMappingURL=users.service.js.map