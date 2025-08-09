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
exports.FaturasService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const telegram_service_1 = require("../telegram/telegram.service");
let FaturasService = class FaturasService {
    constructor(supabase, telegramService) {
        this.supabase = supabase;
        this.telegramService = telegramService;
    }
    async create(userId, createFaturaDto) {
        const { data, error } = await this.supabase
            .from('faturas')
            .insert({
            user_id: userId,
            ...createFaturaDto,
        })
            .select()
            .single();
        if (error) {
            throw new Error(`Erro ao criar fatura: ${error.message}`);
        }
        return data;
    }
    async createBatch(userId, createFaturaBatchDto) {
        const faturasWithUserId = createFaturaBatchDto.faturas.map(fatura => ({
            user_id: userId,
            ...fatura,
        }));
        const { data, error } = await this.supabase
            .from('faturas')
            .insert(faturasWithUserId)
            .select();
        if (error) {
            throw new Error(`Erro ao criar faturas em lote: ${error.message}`);
        }
        if (data && data.length > 0) {
            try {
                const totalValue = data.reduce((sum, fatura) => sum + parseFloat(fatura.valor), 0);
                const competencia = data[0].competencia;
                await this.telegramService.notifyInvoicesImported(userId, data.length, totalValue, competencia);
            }
            catch (notifyError) {
                console.warn('Erro ao enviar notificação de importação de faturas:', notifyError);
            }
        }
        return data;
    }
    async findAll(userId, competencia, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        let query = this.supabase
            .from('faturas')
            .select('*, users!faturas_user_id_fkey(name, email)')
            .in('user_id', userIds)
            .order('created_at', { ascending: false });
        if (competencia) {
            query = query.eq('competencia', competencia);
        }
        const { data, error } = await query;
        if (error) {
            throw new Error(`Erro ao buscar faturas: ${error.message}`);
        }
        const faturasWithOwnership = data.map(fatura => ({
            ...fatura,
            is_own: fatura.user_id === userId,
            owner_name: fatura.users?.name || 'Usuário',
            owner_email: fatura.users?.email || ''
        }));
        return faturasWithOwnership;
    }
    async findOne(userId, id, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        const { data, error } = await this.supabase
            .from('faturas')
            .select('*, users!faturas_user_id_fkey(name, email)')
            .in('user_id', userIds)
            .eq('id', id)
            .single();
        if (error) {
            throw new Error(`Erro ao buscar fatura: ${error.message}`);
        }
        const faturaWithOwnership = {
            ...data,
            is_own: data.user_id === userId,
            owner_name: data.users?.name || 'Usuário',
            owner_email: data.users?.email || ''
        };
        return faturaWithOwnership;
    }
    async update(userId, id, updateFaturaDto, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        const { data, error } = await this.supabase
            .from('faturas')
            .update(updateFaturaDto)
            .in('user_id', userIds)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(`Erro ao atualizar fatura: ${error.message}`);
        }
        return data;
    }
    async remove(userId, id, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        const { error } = await this.supabase
            .from('faturas')
            .delete()
            .in('user_id', userIds)
            .eq('id', id);
        if (error) {
            throw new Error(`Erro ao deletar fatura: ${error.message}`);
        }
        return { message: 'Fatura deletada com sucesso' };
    }
    async getResumoPorCompetencia(userId, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        const { data, error } = await this.supabase
            .from('faturas')
            .select('competencia, valor, banco')
            .in('user_id', userIds);
        if (error) {
            throw new Error(`Erro ao buscar resumo: ${error.message}`);
        }
        const resumo = data.reduce((acc, fatura) => {
            const competencia = fatura.competencia;
            if (!acc[competencia]) {
                acc[competencia] = {
                    competencia,
                    total: 0,
                    quantidade: 0,
                    bancos: new Set()
                };
            }
            acc[competencia].total += parseFloat(fatura.valor);
            acc[competencia].quantidade += 1;
            acc[competencia].bancos.add(fatura.banco);
            return acc;
        }, {});
        return Object.values(resumo).map((item) => ({
            ...item,
            bancos: Array.from(item.bancos)
        }));
    }
};
exports.FaturasService = FaturasService;
exports.FaturasService = FaturasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        telegram_service_1.TelegramService])
], FaturasService);
//# sourceMappingURL=faturas.service.js.map