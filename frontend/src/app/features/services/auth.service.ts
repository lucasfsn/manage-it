import {
  AuthResponse,
  LoginCredentials,
  RefreshTokenResponse,
  RegisterCredentials,
  UpdateUserCredentials,
  UserCredentials,
} from '@/app/features/dto/auth.model';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/app/shared/constants/cookie.constant';
import { Response } from '@/app/shared/dto/response.model';
import { environment } from '@/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, EMPTY, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<UserCredentials | null>(null);
  public loadedUser = this.currentUser.asReadonly();

  public constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  public register(user: RegisterCredentials): Observable<AuthResponse> {
    return this.http
      .post<Response<AuthResponse>>(`${environment.apiUrl}/auth/register`, user)
      .pipe(
        tap((res: Response<AuthResponse>) => {
          const { accessToken, refreshToken, user } = res.data;

          this.storeTokens(accessToken, refreshToken);

          this.currentUser.set(user);

          this.router.navigate(['/dashboard']);
        }),
        map((res: Response<AuthResponse>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public login(user: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<
        Response<AuthResponse>
      >(`${environment.apiUrl}/auth/authenticate`, user)
      .pipe(
        tap((res: Response<AuthResponse>) => {
          const { accessToken, refreshToken, user } = res.data;

          this.storeTokens(accessToken, refreshToken);

          this.currentUser.set(user);

          this.router.navigate(['/dashboard']);
        }),
        map((res: Response<AuthResponse>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public logout(): void {
    this.cookieService.delete(ACCESS_TOKEN_KEY, '/');
    this.cookieService.delete(REFRESH_TOKEN_KEY, '/');

    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    const accessToken = this.cookieService.get(ACCESS_TOKEN_KEY);
    const refreshToken = this.cookieService.get(REFRESH_TOKEN_KEY);
    if (!accessToken || !refreshToken) return false;

    return (
      !this.isTokenExpired(accessToken) || !this.isTokenExpired(refreshToken)
    );
  }

  public getUserByToken(): Observable<UserCredentials> {
    return this.http
      .get<Response<UserCredentials>>(`${environment.apiUrl}/auth/user`)
      .pipe(
        tap((res: Response<UserCredentials>) => {
          this.currentUser.set(res.data);
        }),
        map((res: Response<UserCredentials>) => res.data),
        catchError((err: HttpErrorResponse) => {
          this.logout();

          return throwError(() => err.error);
        }),
      );
  }

  public setUser(updatedData: UpdateUserCredentials): void {
    const user = this.currentUser();
    if (!user) return;

    this.currentUser.set({ ...user, ...updatedData });
  }

  public getLoggedInUsername(): string | undefined {
    return this.currentUser()?.username;
  }

  public refreshToken(): Observable<RefreshTokenResponse> {
    const refreshTokenValue = this.cookieService.check(REFRESH_TOKEN_KEY);

    if (!refreshTokenValue) {
      this.logout();

      return EMPTY;
    }

    return this.http
      .post<
        Response<RefreshTokenResponse>
      >(`${environment.apiUrl}/auth/refresh-token`, {})
      .pipe(
        tap((res: Response<RefreshTokenResponse>) => {
          const { accessToken, refreshToken } = res.data;

          this.storeTokens(accessToken, refreshToken);
        }),
        map((res: Response<RefreshTokenResponse>) => res.data),
        catchError((err: HttpErrorResponse) => {
          this.logout();

          return throwError(() => err.error);
        }),
      );
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    this.cookieService.set(
      ACCESS_TOKEN_KEY,
      accessToken,
      tokenExpiry,
      '/',
      undefined,
      true,
      'Strict',
    );
    this.cookieService.set(
      REFRESH_TOKEN_KEY,
      refreshToken,
      tokenExpiry,
      '/',
      undefined,
      true,
      'Strict',
    );
  }

  public isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false;

      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  }
}
