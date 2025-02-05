import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService } from 'src/app/notification/notification.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any = null;
  username: string | null = null;
  currentUser: any;
  isAdmin: boolean = false;
  isAuthenticated: boolean = false;
  userUnreadCount: number = 0;
  adminUnreadCount: number = 0;
  isAthentificated: boolean = false;

  constructor(private authService: AuthService, private notificationService: NotificationService,private userService: UserService) {}

  ngOnInit(): void {
    this.updateUserStatus();
    this.isAthentificated=this.authService.isAuthenticated();

    this.authService.authStatusChanged.subscribe(() => {
      this.updateUserStatus();
    });

    this.notificationService.userUnreadCount$.subscribe(count => {
      this.userUnreadCount = count;
    });

    this.notificationService.adminUnreadCount$.subscribe(count => {
      this.adminUnreadCount = count;
    });
    
    setInterval(() => {
    if(this.isAthentificated){   this.userService.getProfile().subscribe(
      (data) => { this.user = data; console.log(this.user) },
      (error) => { console.error('Erreur de récupération du profil', error); }
    );}
  }, 2000);
    
  }

  updateUserStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.username = this.authService.getCurrentUser().username;
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'admin';
    
  }

  logout(): void {
    this.authService.logout();
    this.isAthentificated=false;
  }
}
