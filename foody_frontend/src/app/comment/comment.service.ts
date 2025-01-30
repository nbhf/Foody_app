import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient ) {}

  
  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl);
  }
 
   

  saveComment(comment: { content: string, user: string, date: string }): Observable<any> {
    return this.http.post(this.apiUrl, comment);
  }
}
