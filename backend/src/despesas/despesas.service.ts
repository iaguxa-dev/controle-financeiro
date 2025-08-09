import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class DespesasService {
  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private telegramService: TelegramService,
  ) {}

  async create(userId: string, createDespesaDto: CreateDespesaDto) {
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

    // Enviar notificação para o usuário
    try {
      await this.telegramService.notifyNewExpense(userId, data);
    } catch (notifyError) {
      console.warn('Erro ao enviar notificação de nova despesa:', notifyError);
    }

    return data;
  }

  async findAll(userId: string, month?: string, year?: string, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, buscar despesas de todos
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

    // Adicionar flag de propriedade
    const despesasWithOwnership = data.map(despesa => ({
      ...despesa,
      is_own: despesa.user_id === userId,
      owner_name: despesa.users?.name || 'Usuário',
      owner_email: despesa.users?.email || ''
    }));

    return despesasWithOwnership;
  }

  async findOne(userId: string, id: string, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, verificar se a despesa pertence a algum deles
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

    // Adicionar flag de propriedade
    const despesaWithOwnership = {
      ...data,
      is_own: data.user_id === userId,
      owner_name: data.users?.name || 'Usuário',
      owner_email: data.users?.email || ''
    };

    return despesaWithOwnership;
  }

  async update(userId: string, id: string, updateDespesaDto: UpdateDespesaDto, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, verificar se a despesa pertence a algum deles
    const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
    
    // Buscar dados antes da atualização para verificar mudanças
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

    // Enviar notificação se foi marcada como paga
    if (oldData && oldData.status !== 'pago' && updateDespesaDto.status === 'pago') {
      try {
        await this.telegramService.notifyExpensePaid(data.user_id, data);
      } catch (notifyError) {
        console.warn('Erro ao enviar notificação de pagamento:', notifyError);
      }
    }

    return data;
  }

  async remove(userId: string, id: string, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, verificar se a despesa pertence a algum deles
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

  async updateOverdueStatus(userId: string, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, atualizar despesas de todos
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
}
