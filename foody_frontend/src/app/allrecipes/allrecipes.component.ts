import { Component, OnInit } from '@angular/core';
import { AllRecipeService } from './allrecipes.service';
import { Recipe } from '../shared/models/recipe.model';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-allrecipes',
  templateUrl: './allrecipes.component.html',
  styleUrls: ['./allrecipes.component.css']
})
export class AllrecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  private readonly pollInterval = 30000; // Polling every 5 seconds

  constructor(private recipeService: AllRecipeService) {}

  ngOnInit() {
    // Immediately fetch the data when the component is loaded
    this.recipeService.getRecipes().subscribe(
      (data) => this.recipes = data,
      (error) => console.error('Erreur lors de la récupération des recettes', error)
    );

    // Start polling after the initial fetch
    interval(this.pollInterval)
      .pipe(switchMap(() => this.recipeService.getRecipes())) 
      .subscribe(
        (data) => this.recipes = data,
        (error) => console.error('Erreur lors de la récupération des recettes', error)
      );
  }
}
