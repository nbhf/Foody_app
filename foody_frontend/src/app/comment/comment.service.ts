import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
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
  private apiUrl = 'http://localhost:3000/comments';
  constructor(private http: HttpClient, private authService:AuthService) {}

  
  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl);
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

    return this.http.post<any>(this.apiUrl, payload, { headers });
  }
 
}
