import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';




@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient ,private authService:AuthService) {}

  createRecipe(name: string, descrip: string, ing: string, inst: string, category: string, imageUrl: string):Observable<any>{
    const token=this.authService.getToken();
    if(!token){
      throw new Error('Token non trouvé');
    }
  
  
   // Ajouter le token dans l'en-tête de la requête
   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   const ingredients = ing.split('\n').map(item => item.trim());
   const instructions= inst.split('\n').map(item => item.trim());

   const payload={
    name: name,
    description: descrip,
    ingredients: ingredients,
    instructions: instructions ,
    category: category,
    
   }

   return this.http.post<any>(`${this.apiUrl}/recipe/`, payload, { headers });

}

saveRecipe(userId: number, recipeId: number): Observable<any> {
  return this.http.post(`http://localhost:3000/users/${userId}/save-recipe/${recipeId}`, {});
}



// Récupérer les recettes sauvegardées par l'utilisateur
getSavedRecipes(userId: number): Observable<any> {
  return this.http.get(`http://localhost:3000/users/${userId}/saved-recipes`);
}




}
