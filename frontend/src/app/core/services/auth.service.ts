import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { dummyProjects } from '../../dummy-data';
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
    firstName: 'John',
    lastName: 'Doe',
    userName: 'john_doe',
    projects: [dummyProjects[0], dummyProjects[1], dummyProjects[4]],
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
      const user = {
        id: this.dummyUser.id,
        email: this.dummyUser.email,
        firstName: this.dummyUser.firstName,
        lastName: this.dummyUser.lastName,
        userName: this.dummyUser.userName,
      };

      localStorage.setItem('user', JSON.stringify(user));

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
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!(
      localStorage.getItem('access_token') && localStorage.getItem('user')
    );
  }
}
