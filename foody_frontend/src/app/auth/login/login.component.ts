import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formData = { username: '', password: '' };


  constructor(
    private authService:AuthService,
    private router: Router,
    private route: ActivatedRoute) {}

  login() {
    if (!this.formData.username.trim() || !this.formData.password.trim()) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    this.authService.login(this.formData.username, this.formData.password).subscribe({
      next: (response) => {
        const token = response.access_token;
        if (token) {
          this.authService.setToken(token);
          console.log('Connexion réussie ! Token:', token);
          Swal.fire({
            icon: 'success',
            title: 'Succesful connection !',
            text: 'You are logged in.',
            showConfirmButton: true,
            confirmButtonColor: '#3085d6',
            timer: 5000,
          });

          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl, { skipLocationChange: false}).then(() => {
            window.location.reload();  
          });

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
