import { Module } from '@nestjs/common';
import { ReceitasService } from './receitas.service';
import { ReceitasController } from './receitas.controller';
import { DatabaseModule } from '../database/database.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [DatabaseModule, TelegramModule],
  providers: [ReceitasService],
  controllers: [ReceitasController],
  exports: [ReceitasService],
})
export class ReceitasModule {}
