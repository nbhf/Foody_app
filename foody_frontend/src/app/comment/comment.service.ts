import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

export interface Comment {
  id:number;
  content: string;
  username: string;
  report:any;
  
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient, private authService:AuthService) {}

  
  // Récupérer tous les commentaires avec les auteurs
  getComments(): Observable<Comment[]> {
   return this.http.get<any[]>(`${this.apiUrl}/comments`).pipe(
      map(comments => comments.map(comment => ({
        id:comment.id,
        content: comment.content,
        username: comment.author.username,
        report: comment.report // Ajoute un compteur de signalement par défaut

      })))
    );
  }

 // Signaler un commentaire
 reportComment(commentId: number): Observable<Comment | null> {
  return this.http.patch<Comment | null>(`${this.apiUrl}/comments/${commentId}/report`, {});
}
  // Fonction pour sauvegarder un commentaire
  saveComment(commentaire: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token non trouvé');
    }

    // Ajouter le token dans l'en-tête de la requête
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const payload = {
      content: commentaire
    };

    return this.http.post<any>(`${this.apiUrl}/comments/`, payload, { headers });
  }
 

  
}
