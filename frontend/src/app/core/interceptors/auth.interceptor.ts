import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/app/core/constants/local-storage.constants';
import { AuthService } from '@/app/features/services/auth.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';

const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isRefreshTokenRequest = req.url.includes('/refresh-token');
  const token = isRefreshTokenRequest
    ? localStorage.getItem(REFRESH_TOKEN_KEY)
    : localStorage.getItem(ACCESS_TOKEN_KEY);

  return next(addAuthorizationHeader(req, token)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshTokenRequest)
        return handleTokenRefresh(req, next, authService);

      if (error.status === 401) authService.logout();

      return throwError(() => error);
    }),
  );
};

const addAuthorizationHeader = (
  request: HttpRequest<unknown>,
  token: string | null,
): HttpRequest<unknown> => {
  return token
    ? request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      })
    : request;
};

const handleTokenRefresh = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
): Observable<HttpEvent<unknown>> => {
  if (refreshTokenSubject.value === null) {
    refreshTokenSubject.next('PENDING');

    return authService.refreshToken().pipe(
      switchMap(({ accessToken: newAccessToken }) => {
        refreshTokenSubject.next(newAccessToken);

        return next(addAuthorizationHeader(req, newAccessToken));
      }),
      catchError((error) => {
        authService.logout();
        refreshTokenSubject.next(null);

        return throwError(() => error);
      }),
    );
  }

  return refreshTokenSubject.pipe(
    filter((token): token is string => !!token && token !== 'PENDING'),
    take(1),
    switchMap((newAccessToken) =>
      next(addAuthorizationHeader(req, newAccessToken)),
    ),
  );
};
