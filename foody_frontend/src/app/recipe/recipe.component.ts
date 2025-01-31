import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AllRecipeService } from '../allrecipes/allrecipes.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  recipe: any;  // Déclaration pour stocker les données de la recette
  loading: boolean = true;  // Indicateur pour savoir si les données sont en train de se charger
  error: string = '';  // Message d'erreur en cas de problème


  constructor(
    private route: ActivatedRoute,
    private recipeService: AllRecipeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.recipeService.getRecipeById(id).subscribe({
      next: (data) => {
        this.recipe = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load recipe';
        this.loading = false;
      }
    });
  }

  saveRecipe() {
    console.log('Recipe saved:', this.recipe);
    alert('Recipe saved successfully!');
  }
}
