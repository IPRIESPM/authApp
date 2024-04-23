import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(authService.authStatus());
  if(authService.authStatus() === AuthStatus.authenticated  ) {
    return true;
  }

  const url = state.url;
  localStorage.setItem('url', url);
  router.navigate(['/auth/login']);

  return false;
};
