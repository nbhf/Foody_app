import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators'; // Importation de l'opérateur tap

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

  // Fonction pour récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Fonction pour stocker le token dans le localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Fonction pour effacer le token lors de la déconnexion
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Fonction pour vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.getToken();  // Si le token existe, l'utilisateur est authentifié
  }
}
