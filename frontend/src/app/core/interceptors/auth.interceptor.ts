import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/app/core/constants/cookie.constant';
import { AuthService } from '@/app/features/services/auth.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';

const REFRESH_TOKEN_PENDING = 'PENDING';

const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);

  const isRefreshTokenRequest = req.url.includes('/refresh-token');
  const token = isRefreshTokenRequest
    ? cookieService.get(REFRESH_TOKEN_KEY)
    : cookieService.get(ACCESS_TOKEN_KEY);

  return next(addAuthorizationHeader(req, token)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshTokenRequest)
        return handleTokenRefresh(req, next, authService);

      if (error.status === 401) {
        authService.logout();

        return throwError(() => error);
      }

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
  if (refreshTokenSubject.value !== REFRESH_TOKEN_PENDING) {
    refreshTokenSubject.next(REFRESH_TOKEN_PENDING);

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
    filter(
      (token): token is string => !!token && token !== REFRESH_TOKEN_PENDING,
    ),
    take(1),
    switchMap((newAccessToken) =>
      next(addAuthorizationHeader(req, newAccessToken)),
    ),
  );
};
