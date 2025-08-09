import { SupabaseClient } from '@supabase/supabase-js';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { TelegramService } from '../telegram/telegram.service';
export declare class DespesasService {
    private supabase;
    private telegramService;
    constructor(supabase: SupabaseClient, telegramService: TelegramService);
    create(userId: string, createDespesaDto: CreateDespesaDto): Promise<any>;
    findAll(userId: string, month?: string, year?: string, sharedUserIds?: string[]): Promise<any[]>;
    findOne(userId: string, id: string, sharedUserIds?: string[]): Promise<any>;
    update(userId: string, id: string, updateDespesaDto: UpdateDespesaDto, sharedUserIds?: string[]): Promise<any>;
    remove(userId: string, id: string, sharedUserIds?: string[]): Promise<{
        message: string;
    }>;
    updateOverdueStatus(userId: string, sharedUserIds?: string[]): Promise<{
        message: string;
        updated: number;
    }>;
}
