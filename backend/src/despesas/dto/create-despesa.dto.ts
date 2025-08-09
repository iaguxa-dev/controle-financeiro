import { IsString, IsNumber, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreateDespesaDto {
  @IsString()
  descricao: string;

  @IsNumber()
  valor: number;

  @IsDateString()
  data_vencimento: string;

  @IsOptional()
  @IsDateString()
  data_pagamento?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsIn(['pendente', 'pago', 'vencido'])
  status?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
