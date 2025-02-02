import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError} from 'rxjs';
import { tap } from 'rxjs/operators'; // Importation de l'opérateur tap
import {jwtDecode} from 'jwt-decode';  // Importation par défaut


export interface PayloadInterface {
  id: number;
  role: string;
  username: string;
}
import { APP_API } from '../config/app-api.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private username: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}


 // Fonction de connexion pour envoyer les données et récupérer le token
 login(username: string, password: string): Observable<any> {
  const payload = { username, password };
  return this.http.post<any>(APP_API.login, payload).pipe(
    tap((response: { access_token: string }) => {
      if (response && response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('username', username);  
        localStorage.setItem('role',this.getCurrentUser().role );  
        console.log(this.getCurrentUser());
      }
    })
  );
}

signup(userData: any): Observable<any> {
  return this.http.post(APP_API.signup, userData);
}


getUserId(): number | null {
  const token = this.getToken();
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);  // Décodage du token
      console.log('Decoded Token:', decodedToken); // Debugging
      return decodedToken.id;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }
  return null;
}



// getUser(): Observable<any> {
//   const token = localStorage.getItem('token'); 
//   if (!token) return throwError(() => new Error("No token found"));

//   const decodedToken: PayloadInterface = jwtDecode<PayloadInterface>(token);
//   return of(decodedToken);}


  // Fonction pour récupérer le token depuis le localStorage
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
    localStorage.removeItem('role');
    
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); 
  }
}
