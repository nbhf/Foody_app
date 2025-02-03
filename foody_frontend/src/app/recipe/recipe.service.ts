import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { APP_API } from '../config/app-api.config';



@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(private http: HttpClient ,private authService:AuthService) {}

  createRecipe(name: string, descrip: string, ing: string, inst: string, category: string, imageUrl: string):Observable<any>{
  
    const ingredients = ing.split('\n').map(item => item.trim());
   const instructions= inst.split('\n').map(item => item.trim());

   const payload={
    name: name,
    description: descrip,
    ingredients: ingredients,
    instructions: instructions ,
    category: category,
    
   }

   return this.http.post<any>(APP_API.recipe, payload);

}

saveRecipe(userId: number, recipeId: number): Observable<any> {
  return this.http.post(`${APP_API.user}/${userId}/save-recipe/${recipeId}`, {});
}


getSavedRecipes(userId: number): Observable<any> {
  return this.http.get(`${APP_API.user}/${userId}/saved-recipes`);
}


approveRecipe( recipeId: number): Observable<any> {
  return this.http.post(`${APP_API.validate}/${recipeId}`, {});
}

refuseRecipe(recipeId: number): Observable<any> {
  return this.http.post(`${APP_API.refuse}/${recipeId}`, {});
}


}
