import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('despesas')
@UseGuards(JwtAuthGuard)
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @Post()
  create(@Request() req, @Body() createDespesaDto: CreateDespesaDto) {
    return this.despesasService.create(req.user.userId, createDespesaDto);
  }

  @Get()
  findAll(@Request() req, @Query('month') month?: string, @Query('year') year?: string) {
    return this.despesasService.findAll(req.user.userId, month, year, req.user.sharedUserIds);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.despesasService.findOne(req.user.userId, id, req.user.sharedUserIds);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateDespesaDto: UpdateDespesaDto) {
    return this.despesasService.update(req.user.userId, id, updateDespesaDto, req.user.sharedUserIds);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.despesasService.remove(req.user.userId, id, req.user.sharedUserIds);
  }

  @Post('update-overdue')
  updateOverdueStatus(@Request() req) {
    return this.despesasService.updateOverdueStatus(req.user.userId, req.user.sharedUserIds);
  }
}
