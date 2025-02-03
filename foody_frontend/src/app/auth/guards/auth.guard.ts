import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/config/app-routes.config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate([APP_ROUTES.login], { queryParams: { returnUrl: state.url } });
      return false; 
    }
    return true; 
  }
}
