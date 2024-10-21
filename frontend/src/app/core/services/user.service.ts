import { Injectable, signal } from '@angular/core';
import { of, tap } from 'rxjs';
import { usersData } from '../../dummy-data';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = signal<User | null>(null);

  loadedUser = this.user.asReadonly();

  getUserByUsername(username: string) {
    const allUsers = usersData;
    const user = allUsers.find((user) => user.userName === username);

    return of(user).pipe(
      tap({
        next: (user) => {
          if (user) this.user.set(user);
        },
        error: (error) => {
          throw new Error("Couldn't fetch user data. Please try again later.");
        },
      })
    );
  }

  getLoggedInUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
