import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
export declare class SharedAccessGuard implements CanActivate {
    private reflector;
    private jwtService;
    private supabase;
    private configService;
    constructor(reflector: Reflector, jwtService: JwtService, supabase: SupabaseClient, configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
