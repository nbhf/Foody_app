import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import { AuthService } from '../auth/auth.service';
import { RecipeService } from '../recipe/recipe.service';

declare var bootstrap: any; // Pour gérer le modal Bootstrap

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: any = null;
  editMode = false;
  newPassword = '';
  confirmPassword = '';
  savedRecipes: any[] = [];
  createdRecipes: any[] = [];
  showDropdown = false;
  newPhotoUrl = '';
  showButton=true; recipesLoaded=false;
  showButton2=true;  recipesLoaded2=false;
  selectedFile: File | null = null; // Fichier sélectionné
  previewUrl: string | ArrayBuffer | null = null; // Aperçu de l'image
  errorMessage='';

  
 
  enteredPassword='';
  currentAction: 'changePassword' | 'deleteAccount' | null = null;



  constructor(private userService: UserService, private router: Router, private authService: AuthService, private recipesService: RecipeService) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe(
      (data) => { this.user = data; },
      (error) => { console.error('Erreur de récupération du profil', error); }
    );
  }

  updateProfile() {
    
    this.userService.updateProfile(this.user).subscribe(
      (response) => { 
        console.log('Profile updated:', this.user);
        this.editMode = false;  // Cachera le formulaire d'édition
      },
      (error) => { 
        console.error('Erreur de mise à jour du profil', error); 
        this.errorMessage= 'Erreur de mise à jour du profil: username and email should be unique';
      }
    );
  }
  
  // Ouvrir le modal pour changer le mot de passe
  openChangePasswordModal() {
    const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
    modal.show();
  }

  // Changer le mot de passe
  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    this.userService.updateProfile({id: this.user.id, password: this.newPassword }).subscribe(
      () => {
        alert("Mot de passe mis à jour !");
        this.newPassword = '';
        this.confirmPassword = '';
        bootstrap.Modal.getInstance(document.getElementById('changePasswordModal')).hide();
      },
      (error) => { console.error('Erreur de modification du mot de passe', error); }
    );
  }

   // Prépare l'action et ouvre le modal de vérification du mot de passe
   prepareAction(action: 'changePassword' | 'deleteAccount') {
    this.currentAction = action;
    const modal = new bootstrap.Modal(document.getElementById('verifyCurrentPasswordModal'));
    modal.show();
  }

  // Confirmer la suppression du compte
  confirmDelete() {
    if (confirm("Voulez-vous vraiment supprimer votre compte ?")) {
      this.userService.deleteProfile(this.user.id).subscribe(
        () => { this.router.navigate(['/signup']); },
        (error) => { console.error('Erreur de suppression du compte', error); }
      );
      this.authService.logout();

    }
  }
  getSavedRecipes(): void {
    if (this.user.id) {
      this.recipesService.getSavedRecipes(this.user.id).subscribe(
        (recipes) => {
          this.savedRecipes = recipes;
          console.log(this.savedRecipes)
        },
        (error) => {
          console.error("Error fetching saved recipes", error);
        }
      );
    } else {
      console.error("Cannot fetch recipes: User ID is undefined");
    }
  }
  getCreatedRecipes(): void {
    if (this.user.id) {
      this.recipesService.getCreatedRecipes(this.user.id).subscribe(
        (recipes) => {
          this.createdRecipes = recipes;
          console.log(this.createdRecipes)
        },
        (error) => {
          console.error("Error fetching created recipes", error);
        }
      );
    } else {
      console.error("Cannot fetch recipes: User ID is undefined");
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  openVerifyPasswordModal() {
    const modal = new bootstrap.Modal(document.getElementById('verifyCurrentPasswordModal'));
    modal.show();
  }

  // Vérifier le mot de passe actuel
  verifyPassword() {
    this.userService.verifyCurrentPassword(this.user.id, this.enteredPassword).subscribe(
      () => {
        // Si le mot de passe est correct, on ferme le modal de vérification
        bootstrap.Modal.getInstance(document.getElementById('verifyCurrentPasswordModal')).hide();
        
        if (this.currentAction === 'changePassword') {
          // Ouvre le modal pour changer le mot de passe
          const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
          modal.show();
        } else if (this.currentAction === 'deleteAccount') {
          // Appelle la méthode pour confirmer la suppression du compte
          this.confirmDelete();
        }
      },
      (error) => {
        alert('Current password is incorrect');
        console.error('Erreur de vérification du mot de passe', error);
        this.enteredPassword = '';
      }
    );
  }
  // Ouvrir le modal de changement de photo
openChangePhotoModal() {
  this.showDropdown = false; // Fermer le dropdown
  const modal = new bootstrap.Modal(document.getElementById('changePhotoModal'));
  modal.show();
}
onFileSelected(event: any) {
  const file: File = event.target.files[0]; // Récupère le premier fichier sélectionné
  if (file) {
    this.selectedFile = file;
    // Si tu veux afficher un aperçu de l'image avant de la sauvegarder :
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Tu peux utiliser cette donnée pour afficher un aperçu, par exemple :
      console.log('Aperçu de l\'image:', e.target.result);
    };
    reader.readAsDataURL(file);
  }
}


saveNewPhoto() {
  if (this.selectedFile) {
    // Traitement de l'image (par exemple, envoyer à l'API)
    const formData = new FormData();
    formData.append('photo', this.selectedFile);

    // Met à jour l'URL de la photo avec une version locale si nécessaire
    this.user.imgUrl = URL.createObjectURL(this.selectedFile);
    console.log(this.user.imgUrl);
    console.log("Image sélectionnée");

    // Appelle ta méthode pour mettre à jour le backend avec l'image
    this.updateProfile();
    
    // Ferme la modale après l'enregistrement
    const modal = bootstrap.Modal.getInstance(document.getElementById('changePhotoModal'));
    modal.hide();
  }
}



}