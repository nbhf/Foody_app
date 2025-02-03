import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';
import { AuthService } from '../auth/auth.service';
import { Notification } from '../shared/models/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  userNotifications: Notification[] = [];
  adminNotifications: Notification[] = [];
  currentUser: any;
  isAdmin: boolean = false;
 unreadCount =0;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService  
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser(); 
    this.isAdmin = this.currentUser.role === 'admin';  

    if (this.isAdmin) {
      this.loadAdminNotifications();
    } else {
      this.loadUserNotifications();
    }
  }

  loadUserNotifications(): void {
    this.notificationService.getUserNotifications(this.currentUser.id).subscribe(
      (notifications) => {
        this.userNotifications = notifications;
        this.unreadCount = notifications.filter(n => !n.isRead).length;
        this.notificationService.setUserUnreadCount(this.unreadCount ); 
      },
      (error) => {
        console.error('Error loading user notifications', error);
      }
    );
  }

  loadAdminNotifications(): void {
    this.notificationService.getAdminNotifications(this.currentUser.id).subscribe(
     { next: (notifications) => {
        this.adminNotifications = notifications;
        this.unreadCount  = notifications.filter(n => !n.isRead).length;
        this.notificationService.setAdminUnreadCount(this.unreadCount ); 
      },
      error: (error) => {
        console.error('Error loading admin notifications', error);
      }}
    );
  }

  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe(
      { next: () => {
          notification.isRead = true;
          if (this.isAdmin) {
            this.notificationService.setAdminUnreadCount(this.adminNotifications.filter(n => !n.isRead).length);
          } else {
            this.notificationService.setUserUnreadCount(this.userNotifications.filter(n => !n.isRead).length);
          }
        },
        error:(error) => {
          console.error('Error marking notification as read:', error);
        }}
      );
    }
  }
}
