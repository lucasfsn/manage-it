import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UserCredentials,
} from '../dto/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private currentUser = signal<UserCredentials | null>(null);

  public loadedUser = this.currentUser.asReadonly();

  public constructor(private router: Router, private http: HttpClient) {}

  public register(user: RegisterCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, user)
      .pipe(
        tap((res: AuthResponse) => {
          const { token, user } = res;

          this.storeJwtToken(token);
          this.currentUser.set(user);

          this.router.navigate(['/dashboard']);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public login(user: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/authenticate`, user)
      .pipe(
        tap((res: AuthResponse) => {
          const { token, user } = res;

          this.storeJwtToken(token);
          this.currentUser.set(user);

          this.router.navigate(['/dashboard']);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public logout(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  public getUserByToken(): Observable<UserCredentials> {
    const currentUser = this.currentUser();

    if (currentUser) return of(currentUser);

    return this.http
      .get<UserCredentials>(`${environment.apiUrl}/auth/user`)
      .pipe(
        tap((res: UserCredentials) => {
          this.currentUser.set(res);
        }),
        catchError((err: HttpErrorResponse) => {
          this.logout();

          return throwError(() => err.error);
        })
      );
  }

  public getLoggedInUsername(): string | null {
    const currentUser = this.currentUser();

    if (currentUser) return currentUser.username;

    this.logout();

    return null;
  }

  private storeJwtToken(jwt: string): void {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }
}
