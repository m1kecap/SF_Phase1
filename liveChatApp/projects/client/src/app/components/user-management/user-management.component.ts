import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  newUsername: string = '';
  newEmail: string = '';
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  promoteToAdmin(username: string) {
    const user = this.users.find(u => u.username === username);
    if (user && !user.roles.includes('Group Admin')) {
      user.roles.push('Group Admin');
      this.userService.updateUser(user).subscribe(() => {
        this.loadUsers();  
      });
    }
  }

  promoteToSuperAdmin(username: string) {
    const user = this.users.find(u => u.username === username);
    if (user && !user.roles.includes('Super Admin')) {
      user.roles.push('Super Admin');
      this.userService.updateUser(user).subscribe(() => {
        this.loadUsers();  
      });
    }
  }

  createUser() {
    if (!this.newUsername || !this.newEmail) {
      this.errorMessage = 'All fields are required';
      return;
    }
    
    const newUser: User = {
      id: Date.now(),  
      username: this.newUsername,
      email: this.newEmail,
      roles: ['User'],  // default role
      password: '123' 
    };
  
    this.userService.register(newUser).subscribe(() => {
      this.loadUsers();  
      this.newUsername = '';  
      this.newEmail = '';
      this.errorMessage = ''; 
    }, error => {
      this.errorMessage = 'Error creating user';
      console.error('Error creating user:', error);
    });
  }
  

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(user => user.id !== userId);
    }, error => {
      console.error("Error deleting user:", error);
    });
  }
}
