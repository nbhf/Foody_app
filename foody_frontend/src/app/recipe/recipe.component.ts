import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from './recipe.service';
import { AuthService } from '../auth/auth.service';

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
  userID!:number;
  constructor(private http: HttpClient,private recipeService: RecipeService ,private authService: AuthService ) { }

  ngOnInit(): void {
    //Effectuer la requête HTTP pour récupérer la recette avec l'ID 3
    
    this.http.get('http://localhost:3000/recipe/3')
      .subscribe(
        (data) => {
          this.recipe = data;  // Stocker les données récupérées dans la variable recipe
          this.loading = false;  // Mettre à jour l'état de chargement
        },
        (error) => {
          this.error = 'Failed to load recipe';  // En cas d'erreur, afficher un message
          this.loading = false;  // Terminer le chargement

        }
      );

      const token = this.authService.getToken();
    if (token) {
      const decodedToken: any = this.authService.getUserId();  // Décoder le token pour obtenir l'ID de l'utilisateur
      this.userId = decodedToken;  // Assigner l'ID utilisateur à userId
    }  
    
    
  }


  getSavedRecipes(): void {
    if (this.userId) {
      this.recipeService.getSavedRecipes(this.userId).subscribe(
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
    if (this.userId ) {
      this.recipeService.saveRecipe(this.userId, recipeId).subscribe(
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
