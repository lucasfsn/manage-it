import { NotificationDto } from '@/app/features/dto/notification.model';
import { Response } from '@/app/shared/types/response.type';
import { handleApiError } from '@/app/shared/utils/handle-api-error.util';
import { environment } from '@/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = signal<NotificationDto[]>([]);
  public loadedNotifications = this.notifications.asReadonly();

  public constructor(private http: HttpClient) {}

  public getNotifications(): Observable<NotificationDto[]> {
    return this.http
      .get<Response<NotificationDto[]>>(`${environment.apiUrl}/notifications`)
      .pipe(
        map((res: Response<NotificationDto[]>) =>
          res.data.toSorted(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        ),
        tap((data: NotificationDto[]) => this.notifications.set(data)),
        catchError(handleApiError),
      );
  }

  public markAsRead(notificationId: string): Observable<null> {
    const prevNotifications = this.notifications();

    const updatedNotifications = this.notifications().filter(
      (notification) => notification.id !== notificationId,
    );

    this.notifications.set(updatedNotifications);

    return this.http
      .delete<
        Response<null>
      >(`${environment.apiUrl}/notifications/${notificationId}`)
      .pipe(
        map((res: Response<null>) => res.data),
        catchError((err: HttpErrorResponse) => {
          this.notifications.set(prevNotifications);

          return handleApiError(err);
        }),
      );
  }

  public markAllAsRead(): Observable<null> {
    const prevNotifications = this.notifications();

    this.notifications.set([]);

    return this.http
      .delete<Response<null>>(`${environment.apiUrl}/notifications`)
      .pipe(
        map((res: Response<null>) => res.data),
        catchError((err: HttpErrorResponse) => {
          this.notifications.set(prevNotifications);

          return handleApiError(err);
        }),
      );
  }
}
