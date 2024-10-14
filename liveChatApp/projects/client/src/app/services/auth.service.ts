import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const BACKEND_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private roles: string[] = []; // caching roles locally 
  rolesChanged = new EventEmitter<boolean>(); // emit even when role changes

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${BACKEND_URL}/login`, { username, password }).pipe(
      tap(res => {
        if (res.ok) {
          sessionStorage.setItem('userid', res.id.toString());
          sessionStorage.setItem('username', res.username);
          sessionStorage.setItem('roles', JSON.stringify(res.roles));
          this.roles = res.roles; 
          this.rolesChanged.emit(true); 
        }
      }),
      catchError(error => {
        throw 'Wrong username or password';
      })
    );
  }

  logout(): void {
    sessionStorage.clear();
    this.roles = []; 
    this.rolesChanged.emit(false); 
    this.router.navigate(['/login']); 
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('username') != null;
  }

  isUser(): boolean {
    return this.hasRole('User');
  }

  isSuperAdmin(): boolean {
    return this.hasRole('Super Admin');
  }

  isGroupAdmin(): boolean {
    return this.hasRole('Group Admin') || this.isSuperAdmin();
  }

  private hasRole(role: string): boolean {
    if (this.roles.length === 0) {
      this.roles = JSON.parse(sessionStorage.getItem('roles') || '[]'); // fetch from sessionStorage 
    }
    return this.roles.includes(role);
  }

  getUserId(): number {
    const userId = sessionStorage.getItem('userid');
    return userId ? Number(userId) : 0;
  }

  getUsername(): string {
    return sessionStorage.getItem('username') || '';
  }

  
}