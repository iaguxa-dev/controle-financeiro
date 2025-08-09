import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReceitaDto {
  @ApiProperty({ example: 'Salário' })
  @IsString()
  descricao: string;

  @ApiProperty({ example: 5000.00 })
  @IsNumber()
  valor: number;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  data_recebimento: string;

  @ApiProperty({ example: 'Trabalho', required: false })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({ example: 'Salário do mês de janeiro', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
