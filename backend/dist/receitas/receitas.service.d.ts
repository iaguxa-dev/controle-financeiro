import { SupabaseClient } from '@supabase/supabase-js';
import { CreateReceitaDto } from './dto/create-receita.dto';
import { UpdateReceitaDto } from './dto/update-receita.dto';
import { TelegramService } from '../telegram/telegram.service';
export declare class ReceitasService {
    private supabase;
    private telegramService;
    constructor(supabase: SupabaseClient, telegramService: TelegramService);
    create(userId: string, createReceitaDto: CreateReceitaDto): Promise<any>;
    findAll(userId: string, month?: string, year?: string, sharedUserIds?: string[]): Promise<any[]>;
    findOne(userId: string, id: string, sharedUserIds?: string[]): Promise<any>;
    update(userId: string, id: string, updateReceitaDto: UpdateReceitaDto, sharedUserIds?: string[]): Promise<any>;
    remove(userId: string, id: string, sharedUserIds?: string[]): Promise<{
        message: string;
    }>;
    getTotalByMonth(userId: string, month: string, year: string, sharedUserIds?: string[]): Promise<{
        total: number;
    }>;
}
