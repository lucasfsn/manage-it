import { Component, OnInit } from '@angular/core';
import { Notification } from '../../../../features/dto/notification.model';
import { AuthService } from '../../../../features/services/auth.service';
import { LoadingService } from '../../../../features/services/loading.service';
import { NotificationService } from '../../../../features/services/notification.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { NotificationsListComponent } from '../../components/notifications-list/notifications-list.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [SpinnerComponent, NotificationsListComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  get notifications(): Notification[] {
    return this.notificationService
      .loadedNotifications()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  private loadNotifications(): void {
    const userId = this.authService.getLoggedInUsername();

    if (!userId) return;

    this.loadingService.loadingOn();
    this.notificationService.getNotifications(userId).subscribe({
      error: (error: Error) => {
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  ngOnInit(): void {
    this.loadNotifications();
  }
}
