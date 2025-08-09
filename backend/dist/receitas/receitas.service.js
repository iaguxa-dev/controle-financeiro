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
exports.ReceitasService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const telegram_service_1 = require("../telegram/telegram.service");
let ReceitasService = class ReceitasService {
    constructor(supabase, telegramService) {
        this.supabase = supabase;
        this.telegramService = telegramService;
    }
    async create(userId, createReceitaDto) {
        const { data, error } = await this.supabase
            .from('receitas')
            .insert({
            user_id: userId,
            ...createReceitaDto,
        })
            .select()
            .single();
        if (error) {
            throw new Error(`Erro ao criar receita: ${error.message}`);
        }
        try {
            await this.telegramService.notifyNewIncome(userId, data);
        }
        catch (notifyError) {
            console.warn('Erro ao enviar notificação de nova receita:', notifyError);
        }
        return data;
    }
    async findAll(userId, month, year, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        let query = this.supabase
            .from('receitas')
            .select('*, users!receitas_user_id_fkey(name, email)')
            .in('user_id', userIds)
            .order('data_recebimento', { ascending: false });
        if (month && year) {
            const startDate = `${year}-${month.padStart(2, '0')}-01`;
            const endDate = `${year}-${month.padStart(2, '0')}-31`;
            query = query.gte('data_recebimento', startDate).lte('data_recebimento', endDate);
        }
        const { data, error } = await query;
        if (error) {
            throw new Error(`Erro ao buscar receitas: ${error.message}`);
        }
        const receitasWithOwnership = data.map(receita => ({
            ...receita,
            is_own: receita.user_id === userId,
            owner_name: receita.users?.name || 'Usuário',
            owner_email: receita.users?.email || ''
        }));
        return receitasWithOwnership;
    }
    async findOne(userId, id, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        const { data, error } = await this.supabase
            .from('receitas')
            .select('*, users!receitas_user_id_fkey(name, email)')
            .eq('id', id)
            .in('user_id', userIds)
            .single();
        if (error) {
            throw new Error(`Erro ao buscar receita: ${error.message}`);
        }
        return {
            ...data,
            is_own: data.user_id === userId,
            owner_name: data.users?.name || 'Usuário',
            owner_email: data.users?.email || ''
        };
    }
    async update(userId, id, updateReceitaDto, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        const { data, error } = await this.supabase
            .from('receitas')
            .update(updateReceitaDto)
            .eq('id', id)
            .in('user_id', userIds)
            .select()
            .single();
        if (error) {
            throw new Error(`Erro ao atualizar receita: ${error.message}`);
        }
        return data;
    }
    async remove(userId, id, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        const { error } = await this.supabase
            .from('receitas')
            .delete()
            .eq('id', id)
            .in('user_id', userIds);
        if (error) {
            throw new Error(`Erro ao deletar receita: ${error.message}`);
        }
        return { message: 'Receita deletada com sucesso' };
    }
    async getTotalByMonth(userId, month, year, sharedUserIds) {
        const startDate = `${year}-${month.padStart(2, '0')}-01`;
        const endDate = `${year}-${month.padStart(2, '0')}-31`;
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        const { data, error } = await this.supabase
            .from('receitas')
            .select('valor')
            .in('user_id', userIds)
            .gte('data_recebimento', startDate)
            .lte('data_recebimento', endDate);
        if (error) {
            throw new Error(`Erro ao calcular total de receitas: ${error.message}`);
        }
        const total = data.reduce((sum, receita) => sum + parseFloat(receita.valor), 0);
        return { total };
    }
};
exports.ReceitasService = ReceitasService;
exports.ReceitasService = ReceitasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        telegram_service_1.TelegramService])
], ReceitasService);
//# sourceMappingURL=receitas.service.js.map