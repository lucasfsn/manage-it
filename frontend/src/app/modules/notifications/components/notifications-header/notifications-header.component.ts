import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Notification } from '../../../../features/dto/notification.model';
import { NotificationService } from '../../../../features/services/notification.service';

@Component({
  selector: 'app-notifications-header',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './notifications-header.component.html',
  styleUrl: './notifications-header.component.scss',
})
export class NotificationsHeaderComponent {
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
