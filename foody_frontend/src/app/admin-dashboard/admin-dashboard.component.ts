import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

declare var bootstrap: any; // Pour gérer le modal Bootstrap

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = []; // Replace with your User model
  admin: any = null;
  editMode = false;
  newPassword = '';
  confirmPassword = '';
  showDropdown = false;
  newPhotoUrl = '';
  showButton=true; recipesLoaded=false;
  showButton2=true;  recipesLoaded2=false;
  enteredPassword='';
  currentAction: 'changePassword' | 'deleteAccount' | null = null;

  
  constructor(private adminService: AdminService,
              private userService: UserService,
              private authService: AuthService
              , private router: Router
  ) {}

  ngOnInit(): void {
    const adminId = this.authService.getCurrentUser().id;
    this.loadUsers(); // Load users when the component initializes
    this.adminService.getProfile(adminId).subscribe(
      (data) => { this.admin = data; },
      (error) => { console.error('Erreur de récupération du profil', error); }
    );
  }

  updateProfile() {
    this.adminService.updateProfile(this.admin).subscribe(
      (response) => { 
        console.log('Profile updated:', this.admin);
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

    this.adminService.updateProfile({id: this.admin.id, password: this.newPassword }).subscribe(
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
      this.adminService.deleteProfile(this.admin.id).subscribe(
        () => { this.router.navigate(['/signup']); },
        (error) => { console.error('Erreur de suppression du compte', error); }
      );
      this.authService.logout();

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
    this.admin.imgUrl = this.newPhotoUrl; // Mise à jour locale
    console.log(this.admin.imgUrl)
    this.updateProfile(); // Appel de la méthode qui met à jour le backend
    const modal = bootstrap.Modal.getInstance(document.getElementById('changePhotoModal'));
    modal.hide(); // Fermer le modal
  }
}
  
  

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data; // Populate the users array with data from the backend
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  softDeleteUser(userId: number): void {
    this.adminService.softDeleteUser(userId).subscribe({
      next: () => {
        const user = this.users.find((u) => u.id === userId);
        if (user) user.deletedAt = new Date(); // Mark as soft deleted in UI
        alert('User soft deleted successfully.');
      },
      error: (err) => {
        console.error('Error soft deleting user:', err);
        alert('Failed to soft delete user.');
      },
    });
  }

  restoreUser(userId: number): void {
    this.adminService.restoreUser(userId).subscribe({
      next: () => {
        const user = this.users.find((u) => u.id === userId);
        if (user) user.deletedAt = null; // Mark as restored in UI
        alert('User restored successfully.');
      },
      error: (err) => {
        console.error('Error restoring user:', err);
        alert('Failed to restore user.');
      },
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to permanently delete this user?')) {
      this.userService.deleteProfile(userId).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== userId); // Remove from UI
          alert('User deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user.');
        },
      });
    }
  }
}
