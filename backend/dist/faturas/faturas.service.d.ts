import { SupabaseClient } from '@supabase/supabase-js';
import { CreateFaturaDto } from './dto/create-fatura.dto';
import { UpdateFaturaDto } from './dto/update-fatura.dto';
import { CreateFaturaBatchDto } from './dto/create-fatura-batch.dto';
import { TelegramService } from '../telegram/telegram.service';
export declare class FaturasService {
    private supabase;
    private telegramService;
    constructor(supabase: SupabaseClient, telegramService: TelegramService);
    create(userId: string, createFaturaDto: CreateFaturaDto): Promise<any>;
    createBatch(userId: string, createFaturaBatchDto: CreateFaturaBatchDto): Promise<any[]>;
    findAll(userId: string, competencia?: string, sharedUserIds?: string[]): Promise<any[]>;
    findOne(userId: string, id: string, sharedUserIds?: string[]): Promise<any>;
    update(userId: string, id: string, updateFaturaDto: UpdateFaturaDto, sharedUserIds?: string[]): Promise<any>;
    remove(userId: string, id: string, sharedUserIds?: string[]): Promise<{
        message: string;
    }>;
    getResumoPorCompetencia(userId: string, sharedUserIds?: string[]): Promise<any[]>;
}
