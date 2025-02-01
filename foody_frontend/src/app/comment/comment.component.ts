import { Component, OnInit } from '@angular/core';
import { CommentService , Comment } from './comment.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comments: any[] = [];
  loading = true;
  error = '';

  constructor(private commentService: CommentService, private userService:UserService,private authService:AuthService ) {}

  ngOnInit(): void {
    this.loadComments();
    }

    loadComments() {
      this.commentService.getComments().subscribe({
        next: (observables) => {
          // Utilisation de forkJoin pour récupérer tous les utilisateurs en parallèle
          forkJoin(observables).subscribe(commentsWithAuthors => {
            this.comments = commentsWithAuthors;
            this.loading = false;
          });
        },
        error: (err) => {
          this.error = "Erreur lors du chargement des commentaires.";
          console.error(err);
          this.loading = false;
        }
      });
    }

    reportComment(commentId: number) {
      this.commentService.reportComment(commentId).subscribe({
        next: () => alert('Commentaire signalé avec succès !'),
        error: (err) => alert('Erreur lors du signalement du commentaire.')
      });
    }
  }
  

