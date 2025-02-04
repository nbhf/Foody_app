import { Component, OnInit } from '@angular/core';
import { CommentService } from './comment.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comments$!: Observable<any>;
  recipeId!: number;
  comment: string = '';
  reportedComments: number[] = []; // Stocker les commentaires signalés

  constructor(private commentService: CommentService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.recipeId = +params['id']; // Convertir l'ID en nombre
      this.loadComments();
      this.loadReportedComments(); // Charger les commentaires signalés
    });
  }

  // Charger les commentaires
  loadComments(): void {
    this.comments$ = this.commentService.getCommentsByRecipe(this.recipeId);
  }

  // Charger les commentaires signalés depuis le localStorage
  loadReportedComments(): void {
    const storedReports = localStorage.getItem('reportedComments');
    this.reportedComments = storedReports ? JSON.parse(storedReports) : [];
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
        this.loadComments(); // Recharger les commentaires
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
        this.reportedComments.push(commentId);
        localStorage.setItem('reportedComments', JSON.stringify(this.reportedComments));
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
