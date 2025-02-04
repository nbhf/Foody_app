import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { APP_API } from '../config/app-api.config';
import { Notification } from '../shared/models/notification.model';


@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private userUnreadCountSubject = new BehaviorSubject<number>(0);
  private adminUnreadCountSubject = new BehaviorSubject<number>(0);

  userUnreadCount$ = this.userUnreadCountSubject.asObservable();
  adminUnreadCount$ = this.adminUnreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${APP_API.notifications}/user/${userId}`);
  }
 

  getAdminNotifications(adminId: number): Observable<Notification[]>{
    return this.http.get<Notification[]>(`${APP_API.notifications}/admin/${adminId}`);
  }


  markAsRead(notificationId: number): Observable<any> {
    return this.http.patch<void>(`${APP_API.notifications}/${notificationId}/read`, {});
  }

    setUserUnreadCount(count: number): void {
      this.userUnreadCountSubject.next(count);
    }
  
    setAdminUnreadCount(count: number): void {
      this.adminUnreadCountSubject.next(count);
    }

    
} 
