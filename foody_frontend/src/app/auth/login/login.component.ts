import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formData = { username: '', password: '' };


  constructor(private authService:AuthService) {}

  login() {
    if (!this.formData.username.trim() || !this.formData.password.trim()) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    this.authService.login(this.formData.username, this.formData.password).subscribe({
      next: (response) => {
        // Assurez-vous que la réponse contient bien un champ `token`
        const token = response.access_token;
        if (token) {
          this.authService.setToken(token);
          console.log('Connexion réussie ! Token:', token);
          alert('Connexion réussie !');
        } else {
          console.error('Le token n\'a pas été reçu dans la réponse.');
          alert('Erreur : Le token est manquant.');
        }
      },
      error: (error) => {
        console.error('Erreur de connexion', error);
        alert('Erreur de connexion. Vérifiez vos identifiants.');
      }
    });
    
  }
}
