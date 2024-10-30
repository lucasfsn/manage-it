import { Injectable, signal } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { delay, of, tap } from "rxjs";
import { dummyNotifications } from "../../dummy-data";
import { Notification } from "../models/notification.model";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private toastrService: ToastrService) {}

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
          this.toastrService.error("Something went wrong.");
          console.error("Couldn't fetch notifications.", error);
        },
      }),
    );
  }

  markAsRead(notificationId: string) {
    const prevNotifications = this.notifications() || [];

    const updatedNotifications = this.notifications().filter(
      (notification) => notification.id !== notificationId,
    );

    this.notifications.set(updatedNotifications);

    return of(dummyNotifications).pipe(
      delay(500),
      tap({
        error: () => {
          this.notifications.set(prevNotifications);
          this.toastrService.error("Something went wrong.");
        },
      }),
    );
  }

  markAllAsRead() {
    const prevNotifications = this.notifications() || [];

    this.notifications.set([]);

    return of(dummyNotifications).pipe(
      delay(500),
      tap({
        error: () => {
          this.notifications.set(prevNotifications);
          this.toastrService.error("Something went wrong.");
        },
      }),
    );
  }
}
