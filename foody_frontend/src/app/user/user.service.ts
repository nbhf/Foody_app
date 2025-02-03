import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
}


@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private apiUrl = 'http://localhost:3000/users'; // Remplace avec l'URL de ton API

  constructor(private http: HttpClient) {}

  getUserNameById(userId: number): Observable<{ name: string }> {
    return this.http.get<{ name: string }>(`${this.apiUrl}/${userId}/name`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/findAll`);
  }
}
