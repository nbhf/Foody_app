import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Admin } from 'src/admin/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification,Admin])],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService,TypeOrmModule],
})
export class NotificationModule {}
