import { AuthService } from '@/app/features/services/auth.service';
import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';

export const authGuard: CanActivateFn &
  CanActivateChildFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) return of(true);

  return authService.refreshToken().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/auth/login']);

      return of(false);
    }),
  );
};
