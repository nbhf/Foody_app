import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../comment/comment.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  comment: Comment = {
    id: 0,
    content: '',
    authorId: 1 ,
    createdAt: new Date()
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {}

  onSubmit() {
    this.http.post('http://localhost:3000/comments', this.comment).subscribe({
      next: (data) => console.log('Commentaire sauvegardé avec succès'),
      error: (error) =>{ console.error('Erreur lors de la sauvegarde : ', error);
        alert('error saving comment')
         }
    });
  }

}
