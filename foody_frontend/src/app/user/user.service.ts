import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { APP_API } from '../config/app-api.config';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer le profil de l'utilisateur connecté
  getProfile(): Observable<any> {
    return this.http.get(`${APP_API.user}/me`);
  }

  updateProfile(updatedData: any): Observable<any> {
  
    return this.http.patch<{ user: any; access_token?: string }>(`${APP_API.user}/${updatedData.id}`, updatedData).pipe(
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
  deleteProfile(userId: number): Observable<any> {
     const resp = this.http.delete(`${APP_API.user}/${userId}`);
     this.authService.logout();
     return resp;

  }

getAllUsers(): Observable<any> {
  const users = this.http.get(`${APP_API.user}/findAll`);
  return users;
}
saveRecipe(userId: number, recipeId: number): Observable<any> {
  return this.http.post(`${APP_API.user}/${userId}/save-recipe/${recipeId}`, {});
}

getCreatedRecipes(userId: number): Observable<any> {
  return this.http.get(`${APP_API.user}/${userId}/created-recipes`);
}

getSavedRecipes(userId: number): Observable<any> {
  return this.http.get(`${APP_API.user}/${userId}/saved-recipes`);
}

  // Vérifier le mot de passe actuel
  verifyCurrentPassword(userId: number,enteredPassword: string): Observable<any> {
    return this.http.post(`${APP_API.user}/${userId}/verify-password`, { enteredPassword });
  }


}