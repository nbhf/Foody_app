import { Component, OnInit ,EventEmitter,Input,Output } from '@angular/core';
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
  recipe: any; 
  loading: boolean = true;  
  error: string = '';  
  userId: number | null = null;  
  savedRecipes: any[] = [];
  isAdmin= this.authService.getCurrentUser().role =='admin';

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

  }


  approveRecipe(recipeId:number){
    this.recipesService.approveRecipe(recipeId).subscribe(
      (response) => {
        alert('Recipe  approved successfully');
        console.log('Recette sauvegardée !', response);

      },
      (error) => {
        console.error('Error  approving recipe:', error);
        alert('Failed to  approve recipe');
      },
      
    );

  }
    
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

  
  refuseRecipe(recipeId:number){
    this.recipesService.refuseRecipe(recipeId).subscribe(
      (response) => {
        alert('Recipe refused successfully');
        console.log('Recipe refused !', response);

      },
      (error) => {
        console.error('Error saving recipe:', error);
        alert('Failed to refuse recipe');
      },
      
    );
  }
 
}
