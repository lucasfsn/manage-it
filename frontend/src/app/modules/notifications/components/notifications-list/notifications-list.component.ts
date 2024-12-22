import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Notification } from '../../../../features/dto/notification.model';
import { MapperService } from '../../../../features/services/mapper.service';
import { NotificationService } from '../../../../features/services/notification.service';
import { ProfileIconComponent } from '../../../../shared/components/profile-icon/profile-icon.component';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [TimeAgoPipe, ProfileIconComponent, TranslateModule],
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.scss',
})
export class NotificationsListComponent {
  public constructor(
    private notificationService: NotificationService,
    private mapperService: MapperService,
    private router: Router
  ) {}

  protected get notifications(): Notification[] {
    return this.notificationService
      .loadedNotifications()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  protected localeMessage(message: string): string {
    return this.mapperService.notificationMessageMapper(message);
  }

  protected markAsReadAndOpen(notification: Notification): void {
    const { id, projectId, taskId } = notification;

    if (taskId) {
      this.router.navigate(['/projects', projectId, 'tasks', taskId]);
    } else {
      this.router.navigate(['/projects', projectId]);
    }

    this.notificationService.markAsRead(id).subscribe();
  }
}
