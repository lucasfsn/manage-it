import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UserCredentials,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private currentUser = signal<UserCredentials | null>(null);

  loadedUser = this.currentUser.asReadonly();

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private http: HttpClient
  ) {}

  register(user: RegisterCredentials) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, user)
      .pipe(
        tap((res: AuthResponse) => {
          const { token, user } = res;

          this.storeJwtToken(token);
          this.currentUser.set(user);

          this.toastrService.success('Registered successfully!');
          this.router.navigate(['/dashboard']);
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastrService.error(err.error.errorDescription);
          return throwError(() => err);
        })
      );
  }

  login(user: LoginCredentials) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/authenticate`, user)
      .pipe(
        tap((res: AuthResponse) => {
          const { token, user } = res;

          this.storeJwtToken(token);
          this.currentUser.set(user);

          this.toastrService.success('Logged in successfully!');
          this.router.navigate(['/dashboard']);
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastrService.error(err.error.errorDescription);
          return throwError(() => err);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  getUserByToken() {
    const currentUser = this.currentUser();

    if (currentUser) return of(currentUser);

    return this.http
      .get<UserCredentials>(`${environment.apiUrl}/auth/user`)
      .pipe(
        tap((res: UserCredentials) => {
          this.currentUser.set(res);
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastrService.error(err.error.errorDescription);
          this.logout();
          return throwError(() => err);
        })
      );
  }

  getLoggedInUsername(): string | null {
    const currentUser = this.currentUser();

    if (currentUser) return currentUser.username;

    this.logout();
    return null;
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }
}
