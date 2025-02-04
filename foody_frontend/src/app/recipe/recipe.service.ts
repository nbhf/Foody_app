import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { APP_API } from '../config/app-api.config';
import { Recipe } from '../shared/models/recipe.model';



@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipe: Recipe = {
    id:0, // Initialisation de l'objet recipe
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    category: 'lunch', // Ou une valeur par défaut
    photo: null,
    imgUrl:''
    
  };

  constructor(private http: HttpClient ,private authService:AuthService) {}

  createRecipe(name: string, descrip: string, ing: string, inst: string, category: string, imgUrl: string):Observable<any>{
  
    const ingredients = ing.split('\n').map(item => item.trim());
   const instructions= inst.split('\n').map(item => item.trim());
   this.recipe.name=name;
   this.recipe.description=descrip;
   this.recipe.ingredients=ing;
   this.recipe.instructions=inst;
   this.recipe.category=category;
   this.recipe.imgUrl=imgUrl

   return this.http.post<any>(APP_API.recipe, this.recipe);

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

uploadImage(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('image', file);

  return this.http.post<any>(`${APP_API.upload}/image`, formData);
}

}
