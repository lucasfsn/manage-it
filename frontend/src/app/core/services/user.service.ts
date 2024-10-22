import { Injectable, signal } from '@angular/core';
import { of, tap } from 'rxjs';
import { usersData } from '../../dummy-data';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = signal<User | undefined>(undefined);

  loadedUser = this.user.asReadonly();

  getUserByUsername(username: string) {
    const user = usersData.find((user) => user.userName === username);

    return of(user).pipe(
      tap({
        next: (user) => {
          this.user.set(user);
        },
        error: (error) => {
          console.error(
            "Couldn't fetch user data. Please try again later.",
            error
          );
        },
      })
    );
  }

  getLoggedInUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
