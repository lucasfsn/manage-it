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

  public constructor(private http: HttpClient) {}

  public getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${username}`).pipe(
      tap((res: User) => {
        this.user.set(res);
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      })
    );
  }

  public updateUser(updatedData: UpdateUser): Observable<null> {
    return this.http
      .patch<null>(`${environment.apiUrl}/users`, updatedData)
      .pipe(
        tap(() => {
          // res: User; // TODO:

          const prevProject = this.user()!;

          console.log('xd');

          this.user.set({ ...prevProject, ...updatedData });
          // this.project.set(res)
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
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
        return throwError(() => err);
      })
    );
  }
}
