import { Injectable  } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable  } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map} from 'rxjs/operators';
import { APP_API } from '../config/app-api.config';
import { Comment } from '../shared/models/comment.model';


@Injectable({
  providedIn: 'root'
})

export class CommentService {
  constructor(private http: HttpClient, private authService:AuthService) {}


  // Méthode pour récupérer les commentaires d'une recette
  getCommentsByRecipe(recipeId: number): Observable<any> {
    return this.http.get(`${APP_API.comment}/recipe/${recipeId}`);
  }

 // Signaler un commentaire
 reportComment(commentId: number): Observable<Comment | null> {
  return this.http.patch<Comment | null>(`${APP_API.comment}/${commentId}/report`, {});
}
  // Fonction pour sauvegarder un commentaire
  saveComment(commentaire: string,recipeId:number): Observable<any> {   

    const payload = {
      content: commentaire,
      recipeid:recipeId
    };
    console.log("recetteid:",payload);

    return this.http.post<any>(`${APP_API.comment}/${recipeId}`, payload);
  }

  
}
