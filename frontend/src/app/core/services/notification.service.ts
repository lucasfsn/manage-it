import { Injectable, signal } from '@angular/core';
import { delay, of, tap } from 'rxjs';
import { dummyNotifications } from '../../dummy-data';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  loadedNotifications = this.notifications.asReadonly();

  getNotifications(userId: string) {
    return of(dummyNotifications).pipe(
      delay(200),
      tap({
        next: (notifications) => {
          this.notifications.set(notifications);
        },
        error: (error) => {
          console.error("Couldn't fetch notifications.", error);
        },
      })
    );
  }
}
