import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  register() {
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'All fields are required';
      return;
    }
  
    const newUser = {
      id: Date.now(),  
      username: this.username,
      email: this.email,
      password: this.password,
      roles: ['User']  
    };
  
    this.userService.register(newUser).subscribe(() => {
      this.router.navigateByUrl('/login');
      this.errorMessage = ''; 
    }, error => {
      this.errorMessage = error.error.message || "Registration failed";
    });
  }
  
}
