import { Module } from '@nestjs/common';
import { FaturasService } from './faturas.service';
import { FaturasController } from './faturas.controller';
import { DatabaseModule } from '../database/database.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [DatabaseModule, TelegramModule],
  controllers: [FaturasController],
  providers: [FaturasService],
})
export class FaturasModule {}