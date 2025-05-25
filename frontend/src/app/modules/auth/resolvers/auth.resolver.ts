import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { UserCredentials } from '@/app/features/dto/auth.model';
import { AuthService } from '@/app/features/services/auth.service';
import { ErrorResponse } from '@/app/shared/dto/error-response.model';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';

export const authResolver: ResolveFn<UserCredentials | undefined> = () => {
  const authService = inject(AuthService);
  const loadingService = inject(LoadingService);
  const mapperService = inject(MapperService);
  const toastrService = inject(ToastrService);

  loadingService.loadingOn();

  return authService.getUserByToken().pipe(
    catchError((error: ErrorResponse) => {
      const localeMessage = mapperService.errorToastMapper(error.code);
      toastrService.error(localeMessage);

      return of(undefined);
    }),
    finalize(() => loadingService.loadingOff()),
  );
};
