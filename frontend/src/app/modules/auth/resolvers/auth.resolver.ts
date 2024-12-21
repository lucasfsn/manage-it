import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { UserCredentials } from '../../../features/dto/auth.model';
import { AuthService } from '../../../features/services/auth.service';
import { LoadingService } from '../../../features/services/loading.service';

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
