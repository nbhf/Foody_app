import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  getUserNotifications(@Param('userId') userId: number) {
    return this.notificationService.getUserNotifications(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:adminId')
  getAdminNotifications(@Param('adminId') adminId: number) {
    return this.notificationService.getAdminNotifications(adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: number){
    await this.notificationService.markAsRead(id);
    return { message: 'Notification marked as read.' };
  }
}
