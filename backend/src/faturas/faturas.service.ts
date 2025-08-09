import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateFaturaDto } from './dto/create-fatura.dto';
import { UpdateFaturaDto } from './dto/update-fatura.dto';
import { CreateFaturaBatchDto } from './dto/create-fatura-batch.dto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class FaturasService {
  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private telegramService: TelegramService,
  ) {}

  async create(userId: string, createFaturaDto: CreateFaturaDto) {
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

  async createBatch(userId: string, createFaturaBatchDto: CreateFaturaBatchDto) {
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

    // Enviar notificação de importação de faturas
    if (data && data.length > 0) {
      try {
        const totalValue = data.reduce((sum, fatura) => sum + parseFloat(fatura.valor), 0);
        const competencia = data[0].competencia;
        await this.telegramService.notifyInvoicesImported(userId, data.length, totalValue, competencia);
      } catch (notifyError) {
        console.warn('Erro ao enviar notificação de importação de faturas:', notifyError);
      }
    }

    return data;
  }

  async findAll(userId: string, competencia?: string, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, buscar faturas de todos
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

    // Adicionar flag de propriedade
    const faturasWithOwnership = data.map(fatura => ({
      ...fatura,
      is_own: fatura.user_id === userId,
      owner_name: fatura.users?.name || 'Usuário',
      owner_email: fatura.users?.email || ''
    }));

    return faturasWithOwnership;
  }

  async findOne(userId: string, id: string, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, verificar se a fatura pertence a algum deles
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

    // Adicionar flag de propriedade
    const faturaWithOwnership = {
      ...data,
      is_own: data.user_id === userId,
      owner_name: data.users?.name || 'Usuário',
      owner_email: data.users?.email || ''
    };

    return faturaWithOwnership;
  }

  async update(userId: string, id: string, updateFaturaDto: UpdateFaturaDto, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, verificar se a fatura pertence a algum deles
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

  async remove(userId: string, id: string, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, verificar se a fatura pertence a algum deles
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

  async getResumoPorCompetencia(userId: string, sharedUserIds?: string[]) {
    // Se temos usuários compartilhados, buscar faturas de todos
    const userIds = sharedUserIds && sharedUserIds.length > 0 ? sharedUserIds : [userId];
    
    const { data, error } = await this.supabase
      .from('faturas')
      .select('competencia, valor, banco')
      .in('user_id', userIds);

    if (error) {
      throw new Error(`Erro ao buscar resumo: ${error.message}`);
    }

    // Agrupar por competência
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

    // Converter para array e formatar bancos
    return Object.values(resumo).map((item: any) => ({
      ...item,
      bancos: Array.from(item.bancos)
    }));
  }
}
