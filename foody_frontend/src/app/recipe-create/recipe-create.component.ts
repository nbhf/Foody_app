import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipe/recipe.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent {
  @ViewChild('recipeForm') recipeForm!: NgForm; // Ajout de ViewChild pour accéder au formulaire

  recipe = {
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    category: 'LUNCH',
    imageUrl:''
  };

  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  onSubmit() {
    // Vérification si le formulaire est valide
    if (!this.recipeForm.valid) {
      alert("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    this.recipeService.createRecipe(
      this.recipe.name,
      this.recipe.description,
      this.recipe.ingredients,
      this.recipe.instructions,
      this.recipe.category,
      this.recipe.imageUrl
    ).subscribe({
      next: (response) => {
        console.log('Recette créée avec succès:', response);
        alert("Recette créée avec succès !");
      },
      error: (error) => {
        console.error('Erreur lors de la création de la recette:', error);
        alert("Erreur lors de la création de la recette.");
      }
    });
  }
}
