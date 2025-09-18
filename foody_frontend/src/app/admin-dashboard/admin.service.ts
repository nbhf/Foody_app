import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

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

  // Récupérer le profil de l'utilisateur connecté
  getProfile(adminId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/${adminId}`);
  }

  updateProfile(updatedData: any): Observable<any> {
    return this.http.patch<{ admin: any; access_token?: string }>(`apiUrl/admin/${updatedData.id}`, updatedData).pipe(
      tap((response) => {
        console.log("Response from backend:", response);
        console.log("Access Token:", response.access_token);
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token); // 🔹 Mettre à jour le token si modifié
        }
      })
    );
  }
  

  // Supprimer le compte utilisateur
  deleteProfile(adminId: number): Observable<any> {
    console.log(adminId)
      const resp = this.http.delete(`${this.apiUrl}/admin/${adminId}`);
      return resp;
  }

}
