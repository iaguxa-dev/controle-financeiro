import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateFaturaDto {
  @IsString()
  banco: string;

  @IsString()
  competencia: string; // MM/YYYY

  @IsString()
  estabelecimento: string;

  @IsNumber()
  valor: number;

  @IsOptional()
  @IsDateString()
  data_transacao?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
