import { Module } from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { DespesasController } from './despesas.controller';
import { DatabaseModule } from '../database/database.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [DatabaseModule, TelegramModule],
  controllers: [DespesasController],
  providers: [DespesasService],
})
export class DespesasModule {}