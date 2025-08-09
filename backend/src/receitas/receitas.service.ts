import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateReceitaDto } from './dto/create-receita.dto';
import { UpdateReceitaDto } from './dto/update-receita.dto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class ReceitasService {
  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private telegramService: TelegramService,
  ) {}

  async create(userId: string, createReceitaDto: CreateReceitaDto) {
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

    // Enviar notificação para o usuário
    try {
      await this.telegramService.notifyNewIncome(userId, data);
    } catch (notifyError) {
      console.warn('Erro ao enviar notificação de nova receita:', notifyError);
    }

    return data;
  }

  async findAll(userId: string, month?: string, year?: string, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, buscar receitas de todos
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

    // Adicionar flag de propriedade
    const receitasWithOwnership = data.map(receita => ({
      ...receita,
      is_own: receita.user_id === userId,
      owner_name: receita.users?.name || 'Usuário',
      owner_email: receita.users?.email || ''
    }));

    return receitasWithOwnership;
  }

  async findOne(userId: string, id: string, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, verificar se a receita pertence a algum deles
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

    // Adicionar flag de propriedade
    return {
      ...data,
      is_own: data.user_id === userId,
      owner_name: data.users?.name || 'Usuário',
      owner_email: data.users?.email || ''
    };
  }

  async update(userId: string, id: string, updateReceitaDto: UpdateReceitaDto, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, verificar se a receita pertence a algum deles
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

  async remove(userId: string, id: string, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, verificar se a receita pertence a algum deles
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

  async getTotalByMonth(userId: string, month: string, year: string, sharedUserIds?: string[]) {
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-31`;

    // Se temos usuários compartilhados, calcular total de todos
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
}
