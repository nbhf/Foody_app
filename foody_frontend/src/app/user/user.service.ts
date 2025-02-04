import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  // Récupérer le profil de l'utilisateur connecté
  getProfile(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  /* Modifier le profil de l'utilisateur
  updateProfile( updatedData: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.patch(`${this.apiUrl}/7`, updatedData, { headers });
  }*/
  

  // Supprimer le compte utilisateur
  deleteProfile(userId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.delete(`${this.apiUrl}/${userId}`, { headers });
  }

getAllUsers(): Observable<any> {
  const users = this.http.get(`${this.apiUrl}/findAll`);
  return users;
}

}