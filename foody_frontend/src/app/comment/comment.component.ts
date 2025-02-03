import { Component, OnInit,Input } from '@angular/core';
import { CommentService  } from './comment.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';





@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comments: {id: number;  content: string; username: string ,reportCount:number}[] = [];
  comments$!: Observable<any>;
  recipeId!: number;
  loading = true;
  error: string | null = null;
  isExpanded:boolean= false;  
  comment:string='';

  constructor(private commentService: CommentService,private http: HttpClient,private route: ActivatedRoute ) {}

  ngOnInit(): void {
      this.route.params.subscribe(params => {
      this.recipeId = +params['id'];  // Convertir l'ID en nombre
      this.loadComments();  // Charger les commentaires de la recette
    });
    }

    

    // Méthode pour charger les commentaires
   loadComments(): void {
    this.comments$ = this.commentService.getCommentsByRecipe(this.recipeId);
  }

  saveComment() {
    if (!this.comment.trim()) {
      alert('Veuillez entrer un commentaire.');
      return;
    }

    this.commentService.saveComment(this.comment, this.recipeId).subscribe({
       next: (response) => {
        console.log('Commentaire sauvegardé avec succès', response);
        console.log("recette id :",this.recipeId),
        alert('Commentaire sauvegardé !');
        this.comment = ''; 
        this.loadComments(); // Recharger la liste des commentaires
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde du commentaire', error);
        alert('Erreur lors de la sauvegarde du commentaire.');
      }
    });

}

  report(id: number) {
    this.commentService.reportComment(id).subscribe(
{     next:  (updatedComment) => {
        if (updatedComment === null) {
          // Le commentaire a été supprimé
          this.comments = this.comments.filter(comment => comment.id !== id);
        } else {
          // Le compteur de signalements a été mis à jour
          const updatedIndex = this.comments.findIndex(comment => comment.id === id);
          if (updatedIndex !== -1) {
            this.comments[updatedIndex].reportCount = updatedComment.report;
          }
        }
        this.loadComments();
      },
      error:(error) => {
        console.error('Error reporting comment', error);
      }}
    );
  }
         
  
}
