import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/app/core/constants/local-storage.constants';
import { AuthService } from '@/app/features/services/auth.service';
import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  const addTokenToHeader = (
    request: HttpRequest<unknown>,
    token: string | null,
  ): HttpRequest<unknown> => {
    if (token)
      return request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });

    return request;
  };

  let authReq = req;
  if (req.url.includes('/refresh-token')) {
    authReq = addTokenToHeader(req, refreshToken);
  } else {
    authReq = addTokenToHeader(req, accessToken);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401)
        return authService.refreshToken().pipe(
          switchMap((res) => next(addTokenToHeader(req, res.accessToken))),
          catchError((refreshError) => throwError(() => refreshError)),
        );

      return throwError(() => error);
    }),
  );
};
