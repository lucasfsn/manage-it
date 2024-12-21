import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Notification } from '../../../../features/dto/notification.model';
import { NotificationService } from '../../../../features/services/notification.service';
import { NotificationsListComponent } from '../../components/notifications-list/notifications-list.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NotificationsListComponent, TranslateModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  public constructor(private notificationService: NotificationService) {}

  protected markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  protected get notifications(): Notification[] {
    return this.notificationService
      .loadedNotifications()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}
