import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { FaturasService } from './faturas.service';
import { CreateFaturaDto } from './dto/create-fatura.dto';
import { CreateFaturaBatchDto } from './dto/create-fatura-batch.dto';
import { UpdateFaturaDto } from './dto/update-fatura.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('faturas')
@UseGuards(JwtAuthGuard)
export class FaturasController {
  constructor(private readonly faturasService: FaturasService) {}

  @Post()
  create(@Request() req, @Body() createFaturaDto: CreateFaturaDto) {
    return this.faturasService.create(req.user.userId, createFaturaDto);
  }

  @Post('batch')
  createBatch(@Request() req, @Body() createFaturaBatchDto: CreateFaturaBatchDto) {
    return this.faturasService.createBatch(req.user.userId, createFaturaBatchDto);
  }

  @Get()
  findAll(@Request() req, @Query('competencia') competencia?: string) {
    return this.faturasService.findAll(req.user.userId, competencia, req.user.sharedUserIds);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.faturasService.findOne(req.user.userId, id, req.user.sharedUserIds);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateFaturaDto: UpdateFaturaDto) {
    return this.faturasService.update(req.user.userId, id, updateFaturaDto, req.user.sharedUserIds);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.faturasService.remove(req.user.userId, id, req.user.sharedUserIds);
  }
}
