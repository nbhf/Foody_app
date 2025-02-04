import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value ? null : { mismatch: true };
  }

  signup() {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      alert("fromulaire invalide")
      return;
    }

    const { username, email, password } = this.signupForm.value;
    this.authService.signup({ username, email, password }).subscribe({
      next: (response) => {
        alert('Inscription réussie !');
        console.log('Réponse du serveur:', response);
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription', error);
        this.errorMessage = 'Échec de l\'inscription. Veuillez réessayer.';
      }
    });
    this.router.navigateByUrl('/login');
  }
}
