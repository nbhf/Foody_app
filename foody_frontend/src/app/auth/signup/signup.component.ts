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
  previewImageUrl: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      photo: [null]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value ? null : { mismatch: true };
  }

  signup() {
    console.log(this.signupForm);
    if (this.signupForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      alert("Formulaire invalide");
      return;
    }
  
    if (this.signupForm.valid) {
      const signupData = this.signupForm.value;
      console.log(signupData);
  
      const handleSignup = (imgUrl: string | null = null) => {
        const payload = {
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          imgUrl: imgUrl // Peut être une URL d'image ou null
        };
  
        console.log("Payload envoyé à l'API :", payload);
  
        this.authService.signup(payload).subscribe(() => {
          alert('Inscription réussie !!');
          this.signupForm.reset();
          this.previewImageUrl = null;
          this.router.navigateByUrl('/login');
        }, error => {
          console.error('Erreur lors de l\'inscription', error);
          this.errorMessage = 'Échec de l\'inscription. Veuillez réessayer.';
        });
      };
  
      if (signupData.photo) {
        this.authService.uploadImage(signupData.photo).subscribe(response => {
          console.log("Image uploadée avec succès :", response.imageUrl);
          handleSignup(response.imageUrl);
        }, error => {
          console.error('Erreur lors du téléchargement de l\'image', error);
          alert('Erreur lors du téléchargement de l\'image !');
        });
      } else {
        // ✅ Pas d'image fournie → continue sans image
        handleSignup();
      }
      }
  }
  

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.signupForm.patchValue({ photo: file }); // Met à jour le formulaire avec l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result as string; // Définit l'URL de prévisualisation de l'image
      };
      reader.readAsDataURL(file);
    }
  }
}
