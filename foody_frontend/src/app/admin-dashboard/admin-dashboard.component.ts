import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import {  UserService } from '../user/user.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit{
  
  users: User[] = [];
  //recipesOnHold: any[] = [];

  constructor(private adminService: AdminService,
              private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    //this.loadRecipesOnHold();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        console.log('Fetched users:', data); 
        this.users = data;
      },
      error => console.error('Error fetching users:', error),
      
    );
   
  }

}
