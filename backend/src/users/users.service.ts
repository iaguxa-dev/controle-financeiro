import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
  ) {}

  async create(createUserDto: CreateUserDto & { password: string }) {
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', createUserDto.email)
      .single();

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
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

  async findByEmail(email: string) {
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

  async findById(id: string) {
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

  async findBySharingCode(sharingCode: string) {
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

  async update(id: string, updateUserDto: UpdateUserDto) {
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

  async connectWithSharingCode(userId: string, sharingCode: string) {
    // Buscar o usuário pelo sharing_code
    const { data: targetUser, error: targetError } = await this.supabase
      .from('users')
      .select('*')
      .eq('sharing_code', sharingCode)
      .single();

    if (targetError || !targetUser) {
      throw new Error('Código de compartilhamento inválido');
    }

    // Buscar dados do usuário atual
    const { data: currentUser, error: currentError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (currentError || !currentUser) {
      throw new Error('Usuário atual não encontrado');
    }

    // Verificar se já estão conectados
    const { data: existingConnection } = await this.supabase
      .from('compartilhamentos')
      .select('*')
      .or(`and(owner_id.eq.${userId},shared_with_id.eq.${targetUser.id}),and(owner_id.eq.${targetUser.id},shared_with_id.eq.${userId})`)
      .single();

    if (existingConnection) {
      throw new Error('Vocês já estão conectados');
    }

    // Criar compartilhamentos bidirecionais com permissão de edição
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

  async getUsersBySharingCode(sharingCode: string) {
    // Primeiro, encontrar o usuário dono do sharing_code
    const { data: owner, error: ownerError } = await this.supabase
      .from('users')
      .select('id, name, email, sharing_code')
      .eq('sharing_code', sharingCode)
      .single();

    if (ownerError || !owner) {
      throw new Error(`Código de compartilhamento inválido: ${ownerError?.message}`);
    }

    // Buscar todos os usuários conectados (que compartilham com o owner)
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

    // Montar lista de usuários conectados incluindo o owner
    const connectedUsers = [owner];
    
    if (connections) {
      connections.forEach((connection: any) => {
        if (connection.users) {
          connectedUsers.push(connection.users);
        }
      });
    }

    return connectedUsers;
  }
}
