import { Component, OnInit } from '@angular/core';
import { CommentService , Comment } from './comment.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comments: Comment[] = [];
  userName: string = '';

  isAuthenticated: boolean = false;

  constructor(private commentService: CommentService, private userService:UserService,private authService:AuthService ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();  // Vérifie si l'utilisateur est authentifié

    this.commentService.getComments().subscribe(data => {
      this.comments = data;
    });

    const userId = 1; // Remplace par l'ID récupéré dynamiquement
    this.userService.getUserNameById(userId).subscribe(response => {
      this.userName = response.name;
      console.log(this.userName)
    });
  }
  }

