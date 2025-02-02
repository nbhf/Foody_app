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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl1 = 'http://localhost:3000/auth/login';
  private apiUrl2 = 'http://localhost:3000/auth/signup';


  constructor(private http: HttpClient) {}

 // Fonction de connexion pour envoyer les données et récupérer le token
 login(username: string, password: string): Observable<any> {
  const payload = { username, password };
  return this.http.post<any>(this.apiUrl1, payload).pipe(
    tap((response: { access_token: string }) => {
      if (response && response.access_token) {
        localStorage.setItem('access_token', response.access_token);  // Stockez le token dans le localStorage
      }
    })
  );
}

signup(userData: any): Observable<any> {
  return this.http.post(this.apiUrl2, userData);
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



getUser(): Observable<any> {
  const token = localStorage.getItem('token'); 
  if (!token) return throwError(() => new Error("No token found"));

  const decodedToken: PayloadInterface = jwtDecode<PayloadInterface>(token);
  return of(decodedToken);}


  // Fonction pour récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Fonction pour stocker le token dans le localStorage
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Fonction pour effacer le token lors de la déconnexion
  logout(): void {
    localStorage.removeItem('access_token');
  }

  // Fonction pour vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.getToken();  // Si le token existe, l'utilisateur est authentifié
  }
}
