import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification } from '../dto/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  private notifications = signal<Notification[]>([]);

  loadedNotifications = this.notifications.asReadonly();

  getNotifications() {
    return this.http
      .get<Notification[]>(`${environment.apiUrl}/notifications`)
      .pipe(
        tap((res: Notification[]) => {
          this.notifications.set(res);
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        })
      );
  }

  markAsRead(notificationId: string) {
    const prevNotifications = this.notifications() || [];

    const updatedNotifications = this.notifications().filter(
      (notification) => notification.id !== notificationId
    );

    this.notifications.set(updatedNotifications);

    return this.http
      .delete<null>(`${environment.apiUrl}/notifications/${notificationId}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.notifications.set(prevNotifications);
          return throwError(() => err.error);
        })
      );
  }

  markAllAsRead() {
    const prevNotifications = this.notifications() || [];

    this.notifications.set([]);

    return this.http.delete<null>(`${environment.apiUrl}/notifications`).pipe(
      catchError((err: HttpErrorResponse) => {
        this.notifications.set(prevNotifications);
        return throwError(() => err.error);
      })
    );
  }
}
