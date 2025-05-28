import { UpdateUserPayload, UserProfileDto } from '@/app/features/dto/user.dto';
import { AuthService } from '@/app/features/services/auth.service';
import { Response } from '@/app/shared/types/response.type';
import { handleApiError } from '@/app/shared/utils/handle-api-error.util';
import { environment } from '@/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = signal<UserProfileDto | null>(null);
  public loadedUser = this.user.asReadonly();

  public constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  public getUserByUsername(username: string): Observable<UserProfileDto> {
    return this.http
      .get<Response<UserProfileDto>>(`${environment.apiUrl}/users/${username}`)
      .pipe(
        tap((res: Response<UserProfileDto>) => this.user.set(res.data)),
        map((res: Response<UserProfileDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public updateUser(
    updatedData: UpdateUserPayload,
  ): Observable<UserProfileDto> {
    return this.http
      .patch<
        Response<UserProfileDto>
      >(`${environment.apiUrl}/users`, updatedData)
      .pipe(
        tap((res: Response<UserProfileDto>) => {
          this.authService.setUser({
            username: res.data.username,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
          });
          this.user.set(res.data);
        }),
        map((res: Response<UserProfileDto>) => res.data),
        catchError(handleApiError),
      );
  }

  public searchUsers(
    pattern: string,
    projectId?: string,
    taskId?: string,
  ): Observable<UserProfileDto[]> {
    let params = new HttpParams().set('pattern', pattern);

    if (projectId) params = params.set('projectId', projectId);

    if (taskId) params = params.set('taskId', taskId);

    return this.http
      .get<
        Response<UserProfileDto[]>
      >(`${environment.apiUrl}/users/search`, { params })
      .pipe(
        map((res: Response<UserProfileDto[]>) => res.data),
        catchError(handleApiError),
      );
  }
}
