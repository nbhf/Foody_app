import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { CommentService } from '../comment/comment.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  isAuthenticated: boolean = false;

 comment:string='';
  constructor(private commentService:CommentService , private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.checkAuthentication();

  }

  // Vérifier si l'utilisateur est authentifié
  checkAuthentication() {
    this.isAuthenticated = !!this.authService.getToken();
  }

  saveComment() {
    if (!this.comment.trim()) {
      alert('Veuillez entrer un commentaire.');
      return;
    }

    this.commentService.saveComment(this.comment).subscribe({
      next: (response) => {
        console.log('Commentaire sauvegardé avec succès', response);
        alert('Commentaire sauvegardé !');
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde du commentaire', error);
        alert('Erreur lors de la sauvegarde du commentaire.');
      }
    });
  }

}
