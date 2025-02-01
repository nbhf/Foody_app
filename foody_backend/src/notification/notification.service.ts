import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from 'src/user/entities/user.entity';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>
  ) {}

  async createUserNotification(message: string, userId?: number) {
    const notification = this.notificationRepository.create({ 
    message, 
    user: userId ? { id: userId } : null, 
     });
    return this.notificationRepository.save(notification);
  }

  async createNotificationForAllAdmins(message: string) {
    const admins = await this.adminRepository.find();
    
    if (admins.length === 0) {
      throw new Error('No admins found in the database.');
    }
  
    const notifications = admins.map((admin) =>
      this.notificationRepository.create({
        message,
        admin: { id: admin.id },
      })
    );
  
    return this.notificationRepository.save(notifications);
  }
  

  async getUserNotifications(userId: number) {
    return this.notificationRepository.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' }, });
  }

  async getAdminNotifications(adminId: number) {
    return this.notificationRepository.find({ where: { admin: { id: adminId } }, order: { createdAt: 'DESC' },});
  }


  async markAsRead(notificationId: number) {
    await this.notificationRepository.update(notificationId, { isRead: true });
  }
}
