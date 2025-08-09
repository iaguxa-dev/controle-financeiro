import { FaturasService } from './faturas.service';
import { CreateFaturaDto } from './dto/create-fatura.dto';
import { CreateFaturaBatchDto } from './dto/create-fatura-batch.dto';
import { UpdateFaturaDto } from './dto/update-fatura.dto';
export declare class FaturasController {
    private readonly faturasService;
    constructor(faturasService: FaturasService);
    create(req: any, createFaturaDto: CreateFaturaDto): Promise<any>;
    createBatch(req: any, createFaturaBatchDto: CreateFaturaBatchDto): Promise<any[]>;
    findAll(req: any, competencia?: string): Promise<any[]>;
    findOne(req: any, id: string): Promise<any>;
    update(req: any, id: string, updateFaturaDto: UpdateFaturaDto): Promise<any>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
