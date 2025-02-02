import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  username: string | null = null;
  currentUser: any;
  isAdmin: boolean = false;
  userUnreadCount: number = 0;
  adminUnreadCount: number = 0;

  constructor(private authService: AuthService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.username = this.authService.getUser(); 
    this.currentUser = this.authService.getCurrentUser(); 
    this.isAdmin = this.currentUser.role === 'admin'; 

    this.notificationService.userUnreadCount$.subscribe(count => {
      this.userUnreadCount = count;
    });

    this.notificationService.adminUnreadCount$.subscribe(count => {
      this.adminUnreadCount = count;
    });
  }

  logout() {
    this.authService.logout();
    this.username = null; 
  }
}
