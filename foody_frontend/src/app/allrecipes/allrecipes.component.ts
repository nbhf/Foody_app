import { Component, OnInit } from '@angular/core';
import { AllRecipeService } from './allrecipes.service';
import { Recipe } from '../shared/models/recipe.model';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { APP_API } from '../config/app-api.config';
import { APP_ROUTES } from '../config/app-routes.config';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-allrecipes',
  templateUrl: './allrecipes.component.html',
  styleUrls: ['./allrecipes.component.css']
})
export class AllrecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  adminRecipes: Recipe[] = [];
  private readonly pollInterval = 30000; 
  isAdmin: boolean = false;
  currentUser: any;

  constructor(
    private recipeService: AllRecipeService,
    private router: Router,
    private authService: AuthService ) {}
    

  ngOnInit() {

    this.currentUser = this.authService.getCurrentUser(); 
    if(this.currentUser )
    {this.isAdmin = this.currentUser.role === 'admin';  }

    // Immediately fetch the data when the component is loaded
    this.recipeService.getRecipes('Validated').subscribe({
      next: (data) => this.recipes = data,
      error: (error) => console.error('Error fetching recipes', error),
      complete: () => console.log('Request completed')
    });
     

    interval(this.pollInterval)
    .pipe(switchMap(() => this.recipeService.getRecipes('Validated')))
    .subscribe({
      next: (data) => this.recipes = data,
      error: (error) => console.error('Erreur lors de la récupération des recettes', error)
    });

    if(this.isAdmin){
      this.recipeService.getRecipes('on_hold').subscribe({
        next: (data) => this.adminRecipes = data,
        error: (error) => console.error('Error fetching recipes', error),
        complete: () => console.log('Request completed')
      });

      interval(this.pollInterval)
      .pipe(switchMap(() => this.recipeService.getRecipes('on_hold')))
      .subscribe({
        next: (data) => this.adminRecipes = data,
        error: (error) => console.error('Erreur lors de la récupération des recettes', error)
      });
       

    }

  
  }

  viewDetails(id: number) {
    this.router.navigate([APP_ROUTES.recipedetails.replace(':id', id.toString())]); 
  }
}
