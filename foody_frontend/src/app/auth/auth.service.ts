import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators'; // Importation de l'opérateur tap
import { APP_API } from '../config/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private username: string | null = null;

  constructor(private http: HttpClient) {}


 // Fonction de connexion pour envoyer les données et récupérer le token
 login(username: string, password: string): Observable<any> {
  const payload = { username, password };
  return this.http.post<any>(APP_API.login, payload).pipe(
    tap((response: { access_token: string }) => {
      if (response && response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('username', username);  
      }
    })
  );
}

signup(userData: any): Observable<any> {
  return this.http.post(APP_API.signup, userData);
}

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getUser(): string | null {
    return localStorage.getItem('username') || this.username;
  }

   getCurrentUser(): any {
    const token = this.getToken();
    if (!token) return null; 
    const split = token.split('.')[1];  // Le payload est la deuxième partie du JWT
    const decoded = atob(split); // Décoder la partie en base64
    const payload =  JSON.parse(decoded);
    return payload; 
  }


  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); 
  }
}
