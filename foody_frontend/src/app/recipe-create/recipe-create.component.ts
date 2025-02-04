import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipe/recipe.service';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../config/app-routes.config';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
  recipeForm!: FormGroup; 
  recipe = {
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    category: 'LUNCH',
    imageUrl:''
  };

  constructor(private http: HttpClient, private recipeService: RecipeService ,private router: Router, private fb: FormBuilder ) {}
  ngOnInit(): void {
    // Initialisation du formulaire avec FormBuilder
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required, Validators.minLength(10)],
      ingredients: ['', Validators.required],
      instructions: ['', Validators.required],
      category: ['lunch'],
      imageUrl: ['']
    });
  }
  onSubmit() {
    // Vérification si le formulaire est valide
    // if (this.recipeForm.invalid) {
    //   alert("Tous les champs obligatoires doivent être remplis.");
    //   return;
    // }
    const formValues = this.recipeForm.value;

    this.recipeService.createRecipe(
      formValues.name,
      formValues.description,
      formValues.ingredients,
     formValues.instructions,
      formValues.category,
      formValues.imageUrl
    ).subscribe({
      next: (response) => {
        console.log('Recette créée avec succès:', response);
        alert("Recette créée avec succès !");
        this.router.navigateByUrl(APP_ROUTES.allrecipes);

      },
      error: (error) => {
        console.error('Erreur lors de la création de la recette:', error);
        alert("Erreur lors de la création de la recette.");
      }
    });
   
  }
}
