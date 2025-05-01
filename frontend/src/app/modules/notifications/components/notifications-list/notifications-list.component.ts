import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MapperService } from '@/app/core/services/mapper.service';
import { Notification } from '@/app/features/dto/notification.model';
import { NotificationService } from '@/app/features/services/notification.service';
import { ProfileIconComponent } from '@/app/shared/components/profile-icon/profile-icon.component';
import { TimeAgoPipe } from '@/app/shared/pipes/time-ago.pipe';

@Component({
    selector: 'app-notifications-list',
    imports: [TimeAgoPipe, ProfileIconComponent, TranslateModule],
    templateUrl: './notifications-list.component.html',
    styleUrl: './notifications-list.component.scss'
})
export class NotificationsListComponent {
  public constructor(
    private notificationService: NotificationService,
    private mapperService: MapperService,
    private router: Router
  ) {}

  protected get notifications(): Notification[] {
    return this.notificationService.loadedNotifications();
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
