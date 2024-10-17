import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import {
  AuthResponse,
  LoginCredentials,
  UserCredentials,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private apiUrl = 'http://localhost:3000';

  private dummyUser: UserCredentials = {
    id: '123',
    email: 'test@example.com',
    password: '1qazXSW@',
    firstName: 'Test',
    lastName: 'User',
    userName: 'testuser',
  };

  private dummyResponse: AuthResponse = {
    access_token: 'dummy-jwt-token',
  };

  constructor(private http: HttpClient, private router: Router) {}

  login(user: LoginCredentials): Observable<AuthResponse> {
    if (
      user.email === this.dummyUser.email &&
      user.password === this.dummyUser.password
    ) {
      return of(this.dummyResponse).pipe(
        tap((res: AuthResponse) => {
          localStorage.setItem('access_token', res.access_token);
          this.router.navigate(['/dashboard']);
        })
      );
    } else {
      throw new Error('Invalid credentials');
    }
  }

  // login(user: UserCredentials): Observable<AuthResponse> {
  //   console.log('Test');
  //   return this.http.post<AuthResponse>(`${this.apiUrl}/login`, user).pipe(
  //     tap((res: AuthResponse) => {
  //       localStorage.setItem('access_token', res.access_token);
  //     })
  //   );
  // }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }

  getLoggedInUser(): UserCredentials | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
