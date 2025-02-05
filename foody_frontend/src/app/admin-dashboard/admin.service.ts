import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`users/findAll`);
  }

  softDeleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/softDelete/${userId}`, {});
  }

  restoreUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/admin/restore/${userId}`, {});
  }

  deleteUser(userId: number): Observable<void> {
    console.log("User id = ", userId);
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }
}
