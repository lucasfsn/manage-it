import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Notification } from '@/app/features/dto/notification.model';
import { NotificationService } from '@/app/features/services/notification.service';

@Component({
  selector: 'app-notifications-menu',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './notifications-menu.component.html',
  styleUrl: './notifications-menu.component.scss',
})
export class NotificationsMenuComponent {
  public constructor(private notificationService: NotificationService) {}

  protected markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  protected get notifications(): Notification[] {
    return this.notificationService.loadedNotifications();
  }
}
