import { AuthService } from '@/app/features/services/auth.service';
import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn & CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) return true;

  authService.clearTokens();
  router.navigate(['/auth/login']);

  return false;
};
