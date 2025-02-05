import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = []; // Replace with your User model

  constructor(private adminService: AdminService,
              private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers(); // Load users when the component initializes
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data; // Populate the users array with data from the backend
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  softDeleteUser(userId: number): void {
    this.adminService.softDeleteUser(userId).subscribe({
      next: () => {
        const user = this.users.find((u) => u.id === userId);
        if (user) user.deletedAt = new Date(); // Mark as soft deleted in UI
        alert('User soft deleted successfully.');
      },
      error: (err) => {
        console.error('Error soft deleting user:', err);
        alert('Failed to soft delete user.');
      },
    });
  }

  restoreUser(userId: number): void {
    this.adminService.restoreUser(userId).subscribe({
      next: () => {
        const user = this.users.find((u) => u.id === userId);
        if (user) user.deletedAt = null; // Mark as restored in UI
        alert('User restored successfully.');
      },
      error: (err) => {
        console.error('Error restoring user:', err);
        alert('Failed to restore user.');
      },
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to permanently delete this user?')) {
      this.userService.deleteProfile(userId).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== userId); // Remove from UI
          alert('User deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user.');
        },
      });
    }
  }
}
