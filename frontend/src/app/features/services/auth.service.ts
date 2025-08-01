import {
  AuthDto,
  AuthPayload,
  RefreshTokenDto,
  SignupPayload,
  UserDto,
} from '@/app/features/dto/auth.dto';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/app/shared/constants/cookie.constant';
import { Response } from '@/app/shared/types/response.type';
import { handleApiError } from '@/app/shared/utils/handle-api-error.util';
import { environment } from '@/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { catchError, EMPTY, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<UserDto | null>(null);
  public loadedUser = this.currentUser.asReadonly();

  public constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  public register(user: SignupPayload): Observable<AuthDto> {
    return this.http
      .post<Response<AuthDto>>(`${environment.apiUrl}/auth/register`, user)
      .pipe(
        tap((res: Response<AuthDto>) => {
          const { accessToken, refreshToken, user } = res.data;

          this.storeTokens(accessToken, refreshToken);

          this.currentUser.set(user);

          this.router.navigate(['/dashboard']);
        }),
        map((res: Response<AuthDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public login(user: AuthPayload): Observable<AuthDto> {
    return this.http
      .post<Response<AuthDto>>(`${environment.apiUrl}/auth/authenticate`, user)
      .pipe(
        tap((res: Response<AuthDto>) => {
          const { accessToken, refreshToken, user } = res.data;

          this.storeTokens(accessToken, refreshToken);

          this.currentUser.set(user);

          this.router.navigate(['/dashboard']);
        }),
        map((res: Response<AuthDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public logout(): void {
    this.clearTokens();
    this.currentUser.set(null);

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

  public getUserByToken(): Observable<UserDto> {
    return this.http
      .get<Response<UserDto>>(`${environment.apiUrl}/auth/user`)
      .pipe(
        tap((res: Response<UserDto>) => this.currentUser.set(res.data)),
        map((res: Response<UserDto>) => res.data),
        catchError((err: HttpErrorResponse) => {
          this.logout();

          return handleApiError(err);
        }),
      );
  }

  public setUser(updatedData: Partial<UserDto>): void {
    const user = this.currentUser();
    if (!user) return;

    this.currentUser.set({ ...user, ...updatedData });
  }

  public getLoggedInUsername(): string | undefined {
    return this.currentUser()?.username;
  }

  public refreshToken(): Observable<RefreshTokenDto> {
    const hasRefreshToken = this.cookieService.check(REFRESH_TOKEN_KEY);

    if (!hasRefreshToken) {
      this.logout();

      return EMPTY;
    }

    return this.http
      .post<
        Response<RefreshTokenDto>
      >(`${environment.apiUrl}/auth/refresh-token`, {})
      .pipe(
        tap((res: Response<RefreshTokenDto>) => {
          const { accessToken, refreshToken } = res.data;

          this.storeTokens(accessToken, refreshToken);
        }),
        map((res: Response<RefreshTokenDto>) => res.data),
        catchError((err: HttpErrorResponse) => {
          this.logout();

          return handleApiError(err);
        }),
      );
  }

  public isTokenExpired(token: string): boolean {
    try {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.exp) return true;

      const currentTime = Date.now() / 1000;

      return decodedToken.exp < currentTime;
    } catch {
      return true;
    }
  }

  public clearTokens(): void {
    this.cookieService.delete(ACCESS_TOKEN_KEY, '/');
    this.cookieService.delete(REFRESH_TOKEN_KEY, '/');
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
}
