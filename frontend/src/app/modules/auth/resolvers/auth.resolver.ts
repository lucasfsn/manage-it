import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { LoadingService } from '@/app/core/services/loading.service';
import { UserCredentials } from '@/app/features/dto/auth.model';
import { AuthService } from '@/app/features/services/auth.service';

export const authResolver: ResolveFn<UserCredentials | undefined> = () => {
  const authService = inject(AuthService);
  const loadingService = inject(LoadingService);

  loadingService.loadingOn();

  return authService.getUserByToken().pipe(
    catchError(() => {
      return of(undefined);
    }),
    finalize(() => loadingService.loadingOff())
  );
};
