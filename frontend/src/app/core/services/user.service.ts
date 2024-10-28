import { Injectable, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { delay, mergeMap, of, tap, throwError } from 'rxjs';
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

  updateUserData(prevData: User, updatedData: UpdateUser) {
    const updatedUser = { ...prevData, ...updatedData };

    this.user.set(updatedUser);

    return of(updatedUser).pipe(
      delay(500),
      // mergeMap((user) => {
      //   return throwError(() => new Error('Failed to update user data.'));
      // }),
      tap({
        error: (error) => {
          this.user.set(prevData);
          this.toastrService.error('Something went wrong.');
          console.error(
            "Couldn't update user data. Please try again later.",
            error
          );
        },
      })
    );
  }
}
