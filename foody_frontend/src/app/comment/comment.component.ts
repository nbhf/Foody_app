import { Component, OnInit,Input } from '@angular/core';
import { CommentService ,Comment } from './comment.service';
import { HttpClient } from '@angular/common/http';





@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: any;
  comments: {id: number;  content: string; username: string ,reportCount:number}[] = [];
  loading = true;
  error: string | null = null;
  isExpanded:boolean= false;  // Initialiser isExpanded à false pour chaque commentaire

  constructor(private commentService: CommentService,private http: HttpClient ) {}

  ngOnInit(): void {
    this.loadComments();
    }

    loadComments() {
      this.commentService.getComments().subscribe({
        next: (comments: Comment[]) => {
          console.log("Réponse API brute :", comments); // Vérifie la structure des données avant transformation
          this.comments = comments.map(comment => {
            console.log("Commentaire en cours de traitement :", comment); // Voir chaque commentaire
            return {
              id:comment.id,
              content: comment.content,
              username: comment.username,
              reportCount:comment.report,
             
            };
          });
          console.log("Données finales assignées :", this.comments); // Vérifie après transformation
          this.loading = false;
        },
        error: (err) => {
          this.error = "Erreur lors du chargement des commentaires.";
          console.error(err);
          this.loading = false;
        }
      });
      
    }


    report(id: number) {
      this.commentService.reportComment(id).subscribe(
        (updatedComment) => {
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
        },
        (error) => {
          console.error('Error reporting comment', error);
        }
      );
    }
    
    
    

      // Méthode pour gérer l'extension du commentaire
      expandComment(comment: Comment): void {
       this.isExpanded = true;
      }


  }
  

