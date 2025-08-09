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
exports.DespesasService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const telegram_service_1 = require("../telegram/telegram.service");
let DespesasService = class DespesasService {
    constructor(supabase, telegramService) {
        this.supabase = supabase;
        this.telegramService = telegramService;
    }
    async create(userId, createDespesaDto) {
        const { data, error } = await this.supabase
            .from('despesas')
            .insert({
            user_id: userId,
            ...createDespesaDto,
            status: createDespesaDto.status || 'pendente',
        })
            .select()
            .single();
        if (error) {
            throw new Error(`Erro ao criar despesa: ${error.message}`);
        }
        try {
            await this.telegramService.notifyNewExpense(userId, data);
        }
        catch (notifyError) {
            console.warn('Erro ao enviar notificação de nova despesa:', notifyError);
        }
        return data;
    }
    async findAll(userId, month, year, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        let query = this.supabase
            .from('despesas')
            .select('*, users!despesas_user_id_fkey(name, email)')
            .in('user_id', userIds)
            .order('data_vencimento', { ascending: false });
        if (month && year) {
            const startDate = `${year}-${month.padStart(2, '0')}-01`;
            const endDate = `${year}-${month.padStart(2, '0')}-31`;
            query = query.gte('data_vencimento', startDate).lte('data_vencimento', endDate);
        }
        const { data, error } = await query;
        if (error) {
            throw new Error(`Erro ao buscar despesas: ${error.message}`);
        }
        const despesasWithOwnership = data.map(despesa => ({
            ...despesa,
            is_own: despesa.user_id === userId,
            owner_name: despesa.users?.name || 'Usuário',
            owner_email: despesa.users?.email || ''
        }));
        return despesasWithOwnership;
    }
    async findOne(userId, id, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        const { data, error } = await this.supabase
            .from('despesas')
            .select('*, users!despesas_user_id_fkey(name, email)')
            .in('user_id', userIds)
            .eq('id', id)
            .single();
        if (error) {
            throw new Error(`Erro ao buscar despesa: ${error.message}`);
        }
        const despesaWithOwnership = {
            ...data,
            is_own: data.user_id === userId,
            owner_name: data.users?.name || 'Usuário',
            owner_email: data.users?.email || ''
        };
        return despesaWithOwnership;
    }
    async update(userId, id, updateDespesaDto, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        const { data: oldData } = await this.supabase
            .from('despesas')
            .select('*')
            .in('user_id', userIds)
            .eq('id', id)
            .single();
        const { data, error } = await this.supabase
            .from('despesas')
            .update(updateDespesaDto)
            .in('user_id', userIds)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(`Erro ao atualizar despesa: ${error.message}`);
        }
        if (oldData && oldData.status !== 'pago' && updateDespesaDto.status === 'pago') {
            try {
                await this.telegramService.notifyExpensePaid(data.user_id, data);
            }
            catch (notifyError) {
                console.warn('Erro ao enviar notificação de pagamento:', notifyError);
            }
        }
        return data;
    }
    async remove(userId, id, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        const { error } = await this.supabase
            .from('despesas')
            .delete()
            .in('user_id', userIds)
            .eq('id', id);
        if (error) {
            throw new Error(`Erro ao deletar despesa: ${error.message}`);
        }
        return { message: 'Despesa deletada com sucesso' };
    }
    async updateOverdueStatus(userId, sharedUserIds) {
        const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await this.supabase
            .from('despesas')
            .update({ status: 'vencido' })
            .in('user_id', userIds)
            .eq('status', 'pendente')
            .lt('data_vencimento', today)
            .select();
        if (error) {
            throw new Error(`Erro ao atualizar status das despesas: ${error.message}`);
        }
        return {
            message: `${data.length} despesas marcadas como vencidas`,
            updated: data.length
        };
    }
};
exports.DespesasService = DespesasService;
exports.DespesasService = DespesasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        telegram_service_1.TelegramService])
], DespesasService);
//# sourceMappingURL=despesas.service.js.map