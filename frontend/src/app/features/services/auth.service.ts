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
import { handleApiError } from '@/app/shared/utils/handle-api-error.util';
import { environment } from '@/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, EMPTY, Observable, tap, throwError } from 'rxjs';

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
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, user)
      .pipe(
        tap((res: AuthResponse) => {
          const { accessToken, refreshToken, user } = res;

          this.storeTokens(accessToken, refreshToken);

          this.currentUser.set(user);

          this.router.navigate(['/dashboard']);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public login(user: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/authenticate`, user)
      .pipe(
        tap((res: AuthResponse) => {
          const { accessToken, refreshToken, user } = res;

          this.storeTokens(accessToken, refreshToken);

          this.currentUser.set(user);

          this.router.navigate(['/dashboard']);
        }),
        catchError(handleApiError),
      );
  }

  public logout(): void {
    this.cookieService.delete(ACCESS_TOKEN_KEY);
    this.cookieService.delete(REFRESH_TOKEN_KEY);

    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    return this.cookieService.check(ACCESS_TOKEN_KEY);
  }

  public getUserByToken(): Observable<UserCredentials> {
    return this.http
      .get<UserCredentials>(`${environment.apiUrl}/auth/user`)
      .pipe(
        tap((res: UserCredentials) => {
          this.currentUser.set(res);
        }),
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
      .post<RefreshTokenResponse>(
        `${environment.apiUrl}/auth/refresh-token`,
        {},
      )
      .pipe(
        tap((res: RefreshTokenResponse) => {
          const { accessToken, refreshToken } = res;

          this.storeTokens(accessToken, refreshToken);
        }),
        catchError((err: HttpErrorResponse) => {
          this.logout();

          return throwError(() => err.error);
        }),
      );
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    const accessTokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    const refreshTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    this.cookieService.set(
      ACCESS_TOKEN_KEY,
      accessToken,
      accessTokenExpiry,
      '/',
      undefined,
      true,
      'Strict',
    );
    this.cookieService.set(
      REFRESH_TOKEN_KEY,
      refreshToken,
      refreshTokenExpiry,
      '/',
      undefined,
      true,
      'Strict',
    );
  }
}
