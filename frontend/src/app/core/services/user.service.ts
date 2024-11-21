import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdateUser, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = signal<User | undefined>(undefined);

  loadedUser = this.user.asReadonly();

  constructor(private toastrService: ToastrService, private http: HttpClient) {}

  getUserByUsername(username: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${username}`).pipe(
      tap((res: User) => {
        this.user.set(res);
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastrService.error(err.error.message);
        return throwError(() => err);
      })
    );
  }

  updateUserData(prevData: User, updatedData: UpdateUser) {
    const updatedUser = { ...prevData, ...updatedData };

    this.user.set(updatedUser);

    return this.http
      .patch<User>(`${environment.apiUrl}/users/update`, updatedData)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.user.set(prevData);
          this.toastrService.error(err.error.message);
          return throwError(() => err);
        })
      );
  }
}
