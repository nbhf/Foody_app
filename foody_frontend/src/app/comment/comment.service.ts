import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

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
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient, private authService:AuthService) {}

  
  // Récupérer tous les commentaires avec les auteurs
  getComments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/comments`).pipe(
      map(comments =>
        comments.map(comment =>
          this.http.get<any>(`${this.apiUrl}/user/${comment.authorId}`).pipe(
            map(user => ({ ...comment, authorName: user.username }))
          )
        )
      )
    );
  }

  // Signaler un commentaire
  reportComment(commentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments/${commentId}/report`, {});
  }
   
  // Fonction pour sauvegarder un commentaire
  saveComment(commentaire: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const payload = {
      content: commentaire
    };

    return this.http.post<any>(`${this.apiUrl}/comments/`, payload);
  }
 
}
