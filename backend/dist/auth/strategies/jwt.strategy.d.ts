import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private supabase;
    constructor(configService: ConfigService, supabase: SupabaseClient);
    validate(payload: any): Promise<{
        userId: any;
        email: any;
        sharedUserIds: any[];
        sharedUsers: any[];
        sharing_code?: undefined;
    } | {
        userId: any;
        email: any;
        sharing_code: any;
        sharedUserIds: any[];
        sharedUsers: {
            id: any;
            sharing_code: any;
            name: any;
            email: any;
        }[];
    }>;
}
export {};
