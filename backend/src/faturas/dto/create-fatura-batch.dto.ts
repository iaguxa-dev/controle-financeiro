import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFaturaDto } from './create-fatura.dto';

export class CreateFaturaBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFaturaDto)
  faturas: CreateFaturaDto[];
}
