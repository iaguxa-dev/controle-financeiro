import { DespesasService } from './despesas.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
export declare class DespesasController {
    private readonly despesasService;
    constructor(despesasService: DespesasService);
    create(req: any, createDespesaDto: CreateDespesaDto): Promise<any>;
    findAll(req: any, month?: string, year?: string): Promise<any[]>;
    findOne(req: any, id: string): Promise<any>;
    update(req: any, id: string, updateDespesaDto: UpdateDespesaDto): Promise<any>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
    updateOverdueStatus(req: any): Promise<{
        message: string;
        updated: number;
    }>;
}
