import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';
import { APP_API } from '../config/app-api.config';

export interface Comment {
  id: number;
  content: string;
  authorId: 1;
  createdAt: Date;

}

@Injectable({
  providedIn: 'root'
})

export class CommentService {
  constructor(private http: HttpClient, private authService:AuthService) {}

  
  // Récupérer tous les commentaires avec les auteurs
  getComments(): Observable<any[]> {
    return this.http.get<any[]>(APP_API.comment).pipe(
      map(comments =>
        comments.map(comment =>
          this.http.get<any>(`${APP_API.user}/${comment.authorId}`).pipe(
            map(user => ({ ...comment, authorName: user.username }))
          )
        )
      )
    );
  }

  // Signaler un commentaire
  reportComment(commentId: number): Observable<any> {
    return this.http.post(`${APP_API.comment}/${commentId}/report`, {});
  }
   
  // Fonction pour sauvegarder un commentaire
  saveComment(commentaire: string): Observable<any> {

    const payload = {
      content: commentaire
    };

    return this.http.post<any>(APP_API.comment, payload);
  }
 
}
