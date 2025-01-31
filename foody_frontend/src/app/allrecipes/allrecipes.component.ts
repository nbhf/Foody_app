import { Component } from '@angular/core';
import { AllRecipeService } from './allrecipes.service';
import { Recipe } from '../shared/models/recipe.model';

@Component({
  selector: 'app-allrecipes',
  templateUrl: './allrecipes.component.html',
  styleUrls: ['./allrecipes.component.css']
})
export class AllrecipesComponent {
  recipes: Recipe[] = [];

  constructor(private recipeService: AllRecipeService) {}

  ngOnInit() {
    this.getRecipes();
  }

  getRecipes() {
    this.recipeService.getRecipes().subscribe(
      (data) => this.recipes = data,
      (error) => console.error('Erreur lors de la récupération des recettes', error)
    );
  }
}
