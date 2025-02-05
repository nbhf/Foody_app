import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit    {

  isAdmin: boolean = false;
  currentUser: any;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
  this.currentUser = this.authService.getCurrentUser();

  this.isAdmin = this.currentUser?.role === 'admin';}

}
