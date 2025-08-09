import { ReceitasService } from './receitas.service';
import { CreateReceitaDto } from './dto/create-receita.dto';
import { UpdateReceitaDto } from './dto/update-receita.dto';
export declare class ReceitasController {
    private receitasService;
    constructor(receitasService: ReceitasService);
    create(req: any, createReceitaDto: CreateReceitaDto): Promise<any>;
    findAll(req: any, month?: string, year?: string): Promise<any[]>;
    getTotalByMonth(req: any, month: string, year: string): Promise<{
        total: number;
    }>;
    findOne(req: any, id: string): Promise<any>;
    update(req: any, id: string, updateReceitaDto: UpdateReceitaDto): Promise<any>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
