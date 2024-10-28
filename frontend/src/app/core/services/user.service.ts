import { Injectable, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { delay, of, tap } from 'rxjs';
import { usersData } from '../../dummy-data';
import { UpdateUser, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private toastrService: ToastrService) {}

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
          this.toastrService.error('Something went wrong.');
          console.error(
            "Couldn't fetch user data. Please try again later.",
            error
          );
        },
      })
    );
  }

  updateUser(currentUser: User, updatedUserData: UpdateUser) {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updatedUserData };

    const index = usersData.findIndex(
      (user) => user.userName === currentUser.userName
    );

    usersData[index] = updatedUser;

    return of(usersData).pipe(
      delay(300),
      tap({
        error: (error) => {
          this.toastrService.error('Something went wrong.');
          console.error(
            "Couldn't update user data. Please try again later.",
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
