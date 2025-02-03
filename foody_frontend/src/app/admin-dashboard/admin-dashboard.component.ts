import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { User, UserService } from '../user/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit{
  
  users: any[] = [];
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
      data => this.users = data,
      error => console.error('Error fetching users:', error)
    );
  }

}
