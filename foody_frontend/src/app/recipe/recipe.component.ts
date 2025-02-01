import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  recipe: any;  // Déclaration pour stocker les données de la recette
  loading: boolean = true;  // Indicateur pour savoir si les données sont en train de se charger
  error: string = '';  // Message d'erreur en cas de problème

  constructor(private http: HttpClient ) { }

  ngOnInit(): void {
    // Effectuer la requête HTTP pour récupérer la recette avec l'ID 3
    this.http.get('http://localhost:3000/recipe/3')
    .subscribe({
      next: (data) => {
        this.recipe = data;  // Stocker les données récupérées
        this.loading = false;  // Mettre à jour l'état de chargement
      },
      error: (error) => {
        this.error = 'Failed to load recipe';  // Afficher un message en cas d'erreur
        this.loading = false;  // Terminer le chargement
      }
    });
  
  }

  saveRecipe() {
    console.log('Recipe saved:', this.recipe);
    alert('Recipe saved successfully!');
  }
}
