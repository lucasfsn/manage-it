import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdateUser, User } from '../dto/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = signal<User | undefined>(undefined);

  public loadedUser = this.user.asReadonly();

  constructor(private http: HttpClient) {}

  public getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${username}`).pipe(
      tap((res: User) => {
        this.user.set(res);
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err.error);
      })
    );
  }

  public updateUserData(updatedData: UpdateUser): Observable<null> {
    const prevData = this.user();

    if (!prevData) return throwError(() => 'User not found');

    const updatedUser = { ...prevData, ...updatedData };

    this.user.set(updatedUser);

    return this.http
      .patch<null>(`${environment.apiUrl}/users`, updatedData)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.user.set(prevData);

          return throwError(() => err.error);
        })
      );
  }

  public searchUsers(
    pattern: string,
    projectId?: string,
    taskId?: string
  ): Observable<User[]> {
    let url = `${environment.apiUrl}/users/search?pattern=${pattern}${
      projectId ? `&projectId=${projectId}` : ''
    }`;

    if (projectId && taskId) {
      url += `&taskId=${taskId}`;
    }

    return this.http.get<User[]>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err.error);
      })
    );
  }
}
