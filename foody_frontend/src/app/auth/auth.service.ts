import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators'; // Importation de l'opérateur tap
import { APP_API } from '../config/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

 // Fonction de connexion pour envoyer les données et récupérer le token
 login(username: string, password: string): Observable<any> {
  const payload = { username, password };
  return this.http.post<any>(APP_API.login, payload).pipe(
    tap((response: { access_token: string }) => {
      if (response && response.access_token) {
        localStorage.setItem('access_token', response.access_token);  
      }
    })
  );
}

signup(userData: any): Observable<any> {
  return this.http.post(APP_API.signup, userData);
}

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
