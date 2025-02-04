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

  // Confirmer la suppression du compte
  confirmDelete() {
    if (confirm("Voulez-vous vraiment supprimer votre compte ?")) {
      this.userService.deleteProfile(this.user.id).subscribe(
        () => { this.router.navigate(['/signup']); },
        (error) => { console.error('Erreur de suppression du compte', error); }
      );
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
  // Ouvrir le modal de changement de photo
openChangePhotoModal() {
  this.showDropdown = false; // Fermer le dropdown
  const modal = new bootstrap.Modal(document.getElementById('changePhotoModal'));
  modal.show();
}
// Sauvegarder la nouvelle photo
saveNewPhoto() {
  if (this.newPhotoUrl.trim()) {
    this.user.imgUrl = this.newPhotoUrl; // Mise à jour locale
    console.log(this.user.imgUrl)
    console.log("jdrbfu")
    this.updateProfile(); // Appel de la méthode qui met à jour le backend
    const modal = bootstrap.Modal.getInstance(document.getElementById('changePhotoModal'));
    modal.hide(); // Fermer le modal
  }
}
  

}