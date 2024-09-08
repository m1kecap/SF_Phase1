import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'client';
  isSuperAdmin: boolean = false;
  isGroupAdmin: boolean = false;
  isUser: boolean = false;
  isLoggedIn: boolean = false;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, private router: Router,
    public authService: AuthService  
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.authService.rolesChanged.subscribe(() => {
      if (this.isBrowser) { 
        this.updateRoles();
      }
    });
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.updateRoles(); 
      this.authService.rolesChanged.subscribe(() => {
        this.updateRoles(); 
      });
    }
  }

  updateRoles() {
    this.isSuperAdmin = this.authService.isSuperAdmin();
    this.isGroupAdmin = this.authService.isGroupAdmin();
    this.isUser = this.authService.isUser();
    this.isLoggedIn = this.authService.isLoggedIn(); 
  }

  logout() {
    this.authService.logout();
    this.updateRoles(); 
    this.router.navigate(['/login']); 
}
}
