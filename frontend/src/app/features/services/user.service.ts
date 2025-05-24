import { UpdateUserCredentials } from '@/app/features/dto/auth.model';
import { UpdateUser, User } from '@/app/features/dto/user.model';
import { AuthService } from '@/app/features/services/auth.service';
import { Response } from '@/app/shared/dto/response.model';
import { environment } from '@/environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = signal<User | null>(null);
  public loadedUser = this.user.asReadonly();

  public constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  public getUserByUsername(username: string): Observable<User> {
    return this.http
      .get<Response<User>>(`${environment.apiUrl}/users/${username}`)
      .pipe(
        tap((res: Response<User>) => {
          this.user.set(res.data);
        }),
        map((res: Response<User>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public updateUser(updatedData: UpdateUser): Observable<User> {
    return this.http
      .patch<Response<User>>(`${environment.apiUrl}/users`, updatedData)
      .pipe(
        tap((res: Response<User>) => {
          const loggedInUserData: UpdateUserCredentials = {
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            email: updatedData.email,
          };

          this.authService.setUser(loggedInUserData);
          this.user.set(res.data);
        }),
        map((res: Response<User>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public searchUsers(
    pattern: string,
    projectId?: string,
    taskId?: string,
  ): Observable<User[]> {
    let params = new HttpParams().set('pattern', pattern);

    if (projectId) params = params.set('projectId', projectId);

    if (taskId) params = params.set('taskId', taskId);

    return this.http
      .get<Response<User[]>>(`${environment.apiUrl}/users/search`, { params })
      .pipe(
        map((res: Response<User[]>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }
}
