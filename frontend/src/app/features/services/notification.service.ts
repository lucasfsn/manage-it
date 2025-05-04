import { Notification } from '@/app/features/dto/notification.model';
import { environment } from '@/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  public loadedNotifications = this.notifications.asReadonly();

  public constructor(private http: HttpClient) {}

  public getNotifications(): Observable<Notification[]> {
    return this.http
      .get<Notification[]>(`${environment.apiUrl}/notifications`)
      .pipe(
        map((notifications: Notification[]) =>
          notifications.toSorted(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        ),
        tap((sortedNotifications: Notification[]) => {
          this.notifications.set(sortedNotifications);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        }),
      );
  }

  public markAsRead(notificationId: string): Observable<string> {
    const prevNotifications = this.notifications();

    const updatedNotifications = this.notifications().filter(
      (notification) => notification.id !== notificationId,
    );

    this.notifications.set(updatedNotifications);

    return this.http
      .delete(`${environment.apiUrl}/notifications/${notificationId}`, {
        responseType: 'text',
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.notifications.set(prevNotifications);

          return throwError(() => err);
        }),
      );
  }

  public markAllAsRead(): Observable<string> {
    const prevNotifications = this.notifications();

    this.notifications.set([]);

    return this.http
      .delete(`${environment.apiUrl}/notifications`, {
        responseType: 'text',
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.notifications.set(prevNotifications);

          return throwError(() => err);
        }),
      );
  }
}
