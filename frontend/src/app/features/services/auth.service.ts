import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/app/core/constants/local-storage.constants';
import {
  AuthResponse,
  LoginCredentials,
  RefreshTokenResponse,
  RegisterCredentials,
  UpdateUserCredentials,
  UserCredentials,
} from '@/app/features/dto/auth.model';
import { environment } from '@/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN = ACCESS_TOKEN_KEY;
  private readonly REFRESH_TOKEN = REFRESH_TOKEN_KEY;

  private currentUser = signal<UserCredentials | null>(null);
  public loadedUser = this.currentUser.asReadonly();

  public constructor(
    private router: Router,
    private http: HttpClient,
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
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);

    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem(this.ACCESS_TOKEN);
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
    const refreshTokenValue = localStorage.getItem(this.REFRESH_TOKEN);

    if (!refreshTokenValue) {
      this.logout();

      return throwError(() => null);
    }

    return this.http
      .get<RefreshTokenResponse>(`${environment.apiUrl}/auth/refresh-token`)
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
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }
}
