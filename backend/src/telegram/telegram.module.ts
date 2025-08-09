import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TelegramController],
  providers: [TelegramService, NotificationSchedulerService],
  exports: [TelegramService],
})
export class TelegramModule {}
