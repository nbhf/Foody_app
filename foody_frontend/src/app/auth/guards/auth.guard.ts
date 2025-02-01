import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/config/app-routes.config';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');
  if (!token) {
    router.navigate([APP_ROUTES.login], { queryParams: { returnUrl: state.url } });
    return false;
  }
  return true;
};