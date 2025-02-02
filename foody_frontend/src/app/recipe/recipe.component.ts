import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from './recipe.service';
import { AuthService } from '../auth/auth.service';
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
  userId: number | null = null;  // ID de l'utilisateur connecté
  savedRecipes: any[] = [];


  constructor(private recipesService: RecipeService ,private authService: AuthService ,private route: ActivatedRoute,
    private recipeService: AllRecipeService ) { }

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

    
    const token = this.authService.getToken();
    if (token) {
      const decodedToken: any = this.authService.getUserId();  // Décoder le token pour obtenir l'ID de l'utilisateur
      this.userId = decodedToken;  // Assigner l'ID utilisateur à userId
    } 
  }

  getUsername(): string {
    return this.recipe?.createdBy?.username || 'Unknown User';
  }


  getSavedRecipes(): void {
    if (this.userId) {
      this.recipesService.getSavedRecipes(this.userId).subscribe(
        (recipes) => {
          this.savedRecipes = recipes;
        },
        (error) => {
          console.error("Error fetching saved recipes", error);
        }
      );
    } else {
      console.error("Cannot fetch recipes: User ID is undefined");
    }
  }

  // Méthode pour sauvegarder la recette
  saveRecipe(recipeId: number): void {
    const user : any = this.authService.getCurrentUser()
    if (user.id ) {
      this.recipesService.saveRecipe(user.id, recipeId).subscribe(
        (response) => {
          alert('Recipe saved successfully');
          console.log('Recette sauvegardée !', response);

        },
        (error) => {
          console.error('Error saving recipe:', error);
          alert('Failed to save recipe');
        },
        
      );
    } else {
      alert('User not authenticated');
    }
  }



 
}
