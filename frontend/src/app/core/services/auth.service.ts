import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { delay, of, tap } from 'rxjs';
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
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private currentUser = signal<UserCredentials | null>(null);

  loadedUser = this.currentUser.asReadonly();

  private dummyUser: UserCredentials = {
    id: '123',
    email: 'test@example.com',
    password: '1qazXSW@',
    firstName: 'John',
    lastName: 'Doe',
    userName: 'john_doe',
    projects: [dummyProjects[0], dummyProjects[1], dummyProjects[4]],
    createdAt: '2022-01-15',
  };

  private dummyResponse: AuthResponse = {
    access_token: 'dummy-jwt-token',
  };

  constructor(private router: Router, private toastrService: ToastrService) {}

  login(user: LoginCredentials) {
    return of(this.dummyResponse).pipe(
      delay(300),
      tap(() => {
        if (
          user.email !== this.dummyUser.email ||
          user.password !== this.dummyUser.password
        ) {
          this.toastrService.error(
            'Invalid credentials. Please try again later.'
          );
          throw new Error('Invalid credentials');
        }
      }),
      tap((res: AuthResponse) => {
        this.storeJwtToken(res.access_token);
        this.getUser().subscribe();
        this.toastrService.success('Logged in successfully!');
        this.router.navigate(['/dashboard']);
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

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  getUser() {
    const token = localStorage.getItem(this.JWT_TOKEN);

    return of(this.dummyUser).pipe(
      delay(300),
      tap((user: UserCredentials) => {
        this.currentUser.set(user);
      })
    );
  }

  getLoggedInUsername(): string | null {
    if (!this.currentUser()) {
      return null;
    }

    return this.currentUser()!.userName;
  }
}
