import { Component, OnInit } from '@angular/core';
import { CommentService } from './comment.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comments$!: Observable<any>;
  recipeId!: number;
  userId!:number;
  comment: string = '';
  reportedComments: number[] = []; // Stocker les commentaires signalés

  constructor(private commentService: CommentService, private route: ActivatedRoute,private authService : AuthService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.recipeId = +params['id']; // Convertir l'ID en nombre
      this.loadComments(this.recipeId);

    });
  }

  // Charger les commentaires
  loadComments(recipeId:number): void {
    this.userId= this.authService.getCurrentUser().id;
    this.comments$ = this.commentService.getCommentsByRecipe(this.recipeId,this.userId);
  }


  // Sauvegarder un commentaire
  saveComment() {
    if (!this.comment.trim()) {
      alert('Veuillez entrer un commentaire.');
      return;
    }

    this.commentService.saveComment(this.comment, this.recipeId).subscribe({
      next: (response) => {
        alert('Commentaire sauvegardé !');
        this.comment = ''; 
        this.loadComments(this.recipeId); // Recharger les commentaires
      },
      error: () => {
        alert('Erreur lors de la sauvegarde du commentaire.');
      }
    });
  }

  // Signaler un commentaire et le masquer
  report(commentId: number) {
    this.commentService.reportComment(commentId).subscribe({
      next: () => {
        console.log("comment is reported");
        this.loadComments(this.recipeId);
      },
      error: () => {
        alert('Erreur lors du signalement.');
      }
    });
  }

  // Vérifier si un commentaire a été signalé
  isReported(commentId: number): boolean {
    return this.reportedComments.includes(commentId);
  }
}
