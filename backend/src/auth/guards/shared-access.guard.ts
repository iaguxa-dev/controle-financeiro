import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SharedAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new ForbiddenException('Token não fornecido');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'your-secret-key';
      const payload = this.jwtService.verify(token, { secret });
      const userId = payload.sub || payload.userId;

      if (!userId) {
        throw new ForbiddenException('ID do usuário não encontrado no token');
      }

      // Buscar dados do usuário atual
      const { data: currentUser, error: userError } = await this.supabase
        .from('users')
        .select('id, sharing_code')
        .eq('id', userId)
        .single();

      if (userError || !currentUser) {
        throw new ForbiddenException('Usuário não encontrado');
      }

      // Buscar todos os usuários que compartilham o mesmo código
      const { data: sharedUsers, error: sharedError } = await this.supabase
        .from('users')
        .select('id, name, email')
        .eq('sharing_code', currentUser.sharing_code);

      if (sharedError) {
        throw new ForbiddenException('Erro ao buscar usuários compartilhados');
      }

      // Adicionar informações do usuário e usuários compartilhados ao request
      request.user = {
        userId: currentUser.id,
        sharing_code: currentUser.sharing_code,
        sharedUserIds: sharedUsers.map(u => u.id),
        sharedUsers: sharedUsers
      };

      return true;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new ForbiddenException('Token JWT inválido');
      }
      if (error.name === 'TokenExpiredError') {
        throw new ForbiddenException('Token JWT expirado');
      }
      throw new ForbiddenException('Erro na validação do token: ' + error.message);
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
