import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isSuperAdmin = this.authService.isSuperAdmin();
    const isGroupAdmin = this.authService.isGroupAdmin();
    const isUser = this.authService.isUser();
    const requiredRoles = route.data['roles'] || [];

    if (requiredRoles.includes('Super Admin') && isSuperAdmin) {
      return true;
    }

    if (requiredRoles.includes('Group Admin') && isGroupAdmin) {
      return true;
    }

    if (requiredRoles.includes('User') && isUser) {
        return true;
      }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
