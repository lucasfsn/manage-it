import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdateUser, User } from '../dto/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = signal<User | null>(null);

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
    let params = new HttpParams().set('pattern', pattern);

    if (projectId) params = params.set('projectId', projectId);

    if (taskId) params = params.set('taskId', taskId);

    return this.http
      .get<User[]>(`${environment.apiUrl}/users/search`, { params })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }
}
