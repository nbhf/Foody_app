import { Component, OnInit } from '@angular/core';
import { CommentService , Comment } from './comment.service';
import { UserService } from '../user.service';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comments: Comment[] = [];
  userName: string = '';

  constructor(private commentService: CommentService, private userService:UserService ) {}

  ngOnInit(): void {
    this.commentService.getComments().subscribe(data => {
      this.comments = data;
    });

    const userId = 1; // Remplace par l'ID récupéré dynamiquement
    this.userService.getUserNameById(userId).subscribe(response => {
      this.userName = response.name;
      console.log(this.userName);
    });
  }
  }

