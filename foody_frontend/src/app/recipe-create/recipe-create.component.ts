import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import des classes nécessaires
import { RecipeService } from '../recipe/recipe.service';
import { Recipe } from '../shared/models/recipe.model';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
   // Déclaration de l'objet recipe

  
  recipeForm!: FormGroup; // Déclaration du FormGroup
  previewImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder, // Injection du FormBuilder
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    // Initialisation du formulaire avec les contrôles et validations
    this.recipeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Validation pour le nom
      description: ['', [Validators.required, Validators.minLength(10)]], // Validation pour la description
      ingredients: ['', [Validators.required, Validators.minLength(10), this.newlineValidator]], // Validation pour les ingrédients
      instructions: ['', [Validators.required, Validators.minLength(10), this.newlineValidator]], // Validation pour les instructions
      category: ['lunch', Validators.required], // Validation pour la catégorie
      photo: [null] // Photo, facultatif dans ce cas
    });
  }

  // Validation personnalisée pour vérifier qu'il y a au moins un retour à la ligne
  newlineValidator(control: any) {
    if (control.value && !control.value.includes('\n')) {
      return { newlineRequired: true }; // Erreur si pas de retour à la ligne
    }
    return null;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.recipeForm.patchValue({ photo: file }); // Met à jour le formulaire avec l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result as string; // Définit l'URL de prévisualisation de l'image
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    console.log(this.recipeForm)
    if (this.recipeForm.valid) {
      const recipeData = this.recipeForm.value; // Récupère les données du formulaire

      if (recipeData.photo) {
        this.recipeService.uploadImage(recipeData.photo).subscribe(response => {
          const imageUrl = response.imageUrl;  // Récupère l'URL de l'image téléchargée

          const payload = {
            name: recipeData.name,
            description: recipeData.description,
            ingredients: recipeData.ingredients,
            instructions: recipeData.instructions,
            category: recipeData.category,
            imgUrl: imageUrl
          };

          console.log("Payload envoyé à l'API :", payload);

          // Une fois l'image téléchargée, on soumet la recette
          this.recipeService.createRecipe(
            payload.name,
            payload.description,
            payload.ingredients,
            payload.instructions,
            payload.category,
            payload.imgUrl
          ).subscribe(() => {
            alert('Recipe created successfully!');
          }, error => {
            console.error('Error creating recipe:', error);
            alert('Error creating recipe!');
          });
        }, error => {
          console.error('Error uploading image:', error);
          alert('Error uploading image!');
        });
      } else {
        alert('Please select an image!');
      }
    } else {
      alert('Please fill in all required fields correctly!');
    }
  }
}
