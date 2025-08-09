import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    
    try {
      // Buscar dados do usuário atual
      const { data: currentUser, error: userError } = await this.supabase
        .from('users')
        .select('id, sharing_code, name, email')
        .eq('id', userId)
        .single();

      if (userError || !currentUser) {
        return { userId, email: payload.email, sharedUserIds: [userId], sharedUsers: [] };
      }

      // Buscar usuários que compartilham dados com o usuário atual
      // Incluir tanto os que ele compartilha quanto os que compartilham com ele
      const { data: connections, error: connectionsError } = await this.supabase
        .from('compartilhamentos')
        .select(`
          owner_id,
          shared_with_id,
          owner:users!compartilhamentos_owner_id_fkey (id, name, email),
          shared_with:users!compartilhamentos_shared_with_id_fkey (id, name, email)
        `)
        .or(`owner_id.eq.${userId},shared_with_id.eq.${userId}`);

      // Montar lista de usuários compartilhados
      const sharedUsers = [currentUser]; // Incluir o usuário atual
      const sharedUserIds = [userId];

      if (connections && !connectionsError) {
        connections.forEach((connection: any) => {
          if (connection.owner_id === userId && connection.shared_with) {
            // O usuário atual é o owner, adicionar o shared_with
            sharedUsers.push(connection.shared_with);
            sharedUserIds.push(connection.shared_with.id);
          } else if (connection.shared_with_id === userId && connection.owner) {
            // O usuário atual é o shared_with, adicionar o owner
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
    } catch (error) {
      // Em caso de erro, retornar dados básicos
      return { userId, email: payload.email, sharedUserIds: [userId], sharedUsers: [] };
    }
  }
}
