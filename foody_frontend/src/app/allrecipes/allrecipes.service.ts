import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../shared/models/recipe.model';
import { APP_API } from '../config/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class AllRecipeService {

  constructor(private http: HttpClient) {}

  getRecipes(status:string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${APP_API.recipe}/${status}`);
  }

  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${APP_API.recipe}/details/${id}`);
  }

}
