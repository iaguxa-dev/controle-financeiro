import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  Query 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReceitasService } from './receitas.service';
import { CreateReceitaDto } from './dto/create-receita.dto';
import { UpdateReceitaDto } from './dto/update-receita.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('receitas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('receitas')
export class ReceitasController {
  constructor(private receitasService: ReceitasService) {}

  @ApiOperation({ summary: 'Criar nova receita' })
  @Post()
  create(@Request() req, @Body() createReceitaDto: CreateReceitaDto) {
    return this.receitasService.create(req.user.userId, createReceitaDto);
  }

  @ApiOperation({ summary: 'Listar todas as receitas' })
  @ApiQuery({ name: 'month', required: false })
  @ApiQuery({ name: 'year', required: false })
  @Get()
  findAll(
    @Request() req,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.receitasService.findAll(req.user.userId, month, year, req.user.sharedUserIds);
  }

  @ApiOperation({ summary: 'Total de receitas por mês' })
  @Get('total/:month/:year')
  getTotalByMonth(
    @Request() req,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.receitasService.getTotalByMonth(req.user.userId, month, year, req.user.sharedUserIds);
  }

  @ApiOperation({ summary: 'Obter receita por ID' })
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.receitasService.findOne(req.user.userId, id, req.user.sharedUserIds);
  }

  @ApiOperation({ summary: 'Atualizar receita' })
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateReceitaDto: UpdateReceitaDto,
  ) {
    return this.receitasService.update(req.user.userId, id, updateReceitaDto, req.user.sharedUserIds);
  }

  @ApiOperation({ summary: 'Deletar receita' })
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.receitasService.remove(req.user.userId, id, req.user.sharedUserIds);
  }
}
